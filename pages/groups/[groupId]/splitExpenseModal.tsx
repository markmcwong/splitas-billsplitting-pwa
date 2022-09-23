import { Check } from "@mui/icons-material";
import {
  InputAdornment,
  Grid,
  Typography,
  ListItem,
  ListItemIcon,
  Input,
  Button,
  Divider,
  List,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import ModalContent from "../../../components/Modal";
import "../../../utils/class_extension.ts";
import * as url from "../../../utils/urls";
import * as models from "../../../utils/models";
import grey from "@mui/material/colors/grey";
import { check_cookie_by_name } from "../../../utils/class_extension";

type PropsType = {
  open: boolean;
  handleClose: () => void;
  expenseId?: number;
  groupId: string;
};

type SplitsType = models.Split & {
  Expense: models.Expense & { Payer: models.User };
  User: models.User;
};

const ViewSplitsModal = ({
  open,
  handleClose,
  expenseId,
  groupId,
}: PropsType) => {
  /* Lifecycle hooks start */
  const [splits, setSplits] = useState<SplitsType[]>([]);
  const [originalSplit, setOriginalSplit] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean[]>([]);
  const currentUserId = check_cookie_by_name("userId");

  useEffect(() => {
    if (expenseId !== undefined && groupId !== undefined) getSplitsByExpense();
  }, [expenseId]);
  /* Lifecycle hooks end */

  /* Network functions start */
  const getSplitsByExpense = () => {
    if (expenseId !== null && groupId !== null) {
      fetch(`${url.api}/user/groups/${groupId}/expense/${expenseId}`)
        .then((res) => res.json())
        .then((splits) => {
          setSplits(splits);
          setOriginalSplit(splits);
          setIsEditing(splits.map(() => false));
        });
    }
  };

  const createPayment = () => {
    const postBody = splits
      .filter((x) => x.User.id === parseInt(currentUserId!))
      .map((split) => {
        return { paidToId: split.id, amount: split.amount };
      })[0];
    fetch(`${url.api}/user/groups/${groupId}/expense/${expenseId}`, {
      method: "POST",
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .then(() => handleClose());
  };

  const updateSplits = () => {
    const postBody = splits.map((split) => {
      return { id: split.id, amount: split.amount };
    });
    fetch(`${url.api}/user/groups/${groupId}/split`, {
      method: "POST",
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .then(() => handleClose());
  };
  /* Network functions end */

  const PayButton = () => {
    return (
      <Button
        variant="contained"
        onClick={() => {
          createPayment();
        }}
      >
        <Typography color="white">Pay now</Typography>
      </Button>
    );
  };

  return (
    <ModalContent
      open={open}
      handleClose={handleClose}
      title={"Expense Details"}
      rightContent={
        splits.some((split) => split.User.id === parseInt(currentUserId!))
          ? PayButton()
          : null
      }
    >
      <>
        {splits.length > 0 && (
          <>
            <Grid display="flex" container sx={{ py: 2 }}>
              <Grid item xs={4}>
                <Typography variant="body1" color="text.primary">
                  Paid by:
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body1"
                  color="text.primary"
                  // textAlign="right"
                  className="padding__right-2"
                >
                  {splits[0].Expense.Payer.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              display="flex"
              container
              className="padding__bottom-2 padding__right-2"
            >
              <Grid item xs={12}>
                <Typography variant="body1" color="text.primary">
                  Total Expense:
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body1" color="text.primary">
                  {splits[0].Expense.amount}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
        <Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" color="background.default">
              View Splits{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color={grey[400]}>
              (Edit by double clicking on the amount)
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <List>
          {splits.map((split, i) => (
            <ListItem key={i} sx={{ ml: 0, pl: 0, display: "flex" }}>
              <ListItemIcon
                className="container--two-third-width container--row"
                sx={{
                  borderRadius: 2,
                }}
              >
                <Typography>
                  {split.User.name.length > 20
                    ? split.User.name.substring(0, 17) + "..."
                    : split.User.name}
                </Typography>
              </ListItemIcon>
              {isEditing[i] === true ? (
                <Input
                  className="container--third-width"
                  type="number"
                  value={split.amount}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  onChange={(e) => {
                    let splitsCopy = [...splits];
                    splitsCopy[i] = {
                      ...splitsCopy[i],
                      amount: parseInt(e.target.value),
                    };
                    setSplits(splitsCopy);
                  }}
                  placeholder="Amount"
                  // size="small"
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => {
                          setIsEditing(
                            isEditing.map((_, idx) => (idx == i ? false : _))
                          );
                        }}
                      >
                        <Check />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              ) : (
                <Typography
                  color="text.primary"
                  className="container--full-width"
                  textAlign="end"
                  onClick={() => {
                    setIsEditing(
                      isEditing.map((_, idx) => (idx == i ? true : _))
                    );
                  }}
                >
                  {split.amount}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
        {splits.length > 0 &&
          originalSplit !== splits &&
          splits.reduce((a, b) => a + b.amount, 0) >
            splits[0].Expense.amount && (
            <Typography color="error.main" className="margin__bottom--2">
              Total amount is greater than original expense: $
              {splits[0].Expense.amount}
            </Typography>
          )}
        {splits.length > 0 && originalSplit !== splits && (
          <Button
            variant="outlined"
            disabled={
              isEditing.some((x) => x) ||
              splits.reduce((a, b) => a + b.amount, 0) !=
                splits[0].Expense.amount
            }
            onClick={() => updateSplits()}
          >
            Submit
          </Button>
        )}
      </>
    </ModalContent>
  );
};

export default ViewSplitsModal;
