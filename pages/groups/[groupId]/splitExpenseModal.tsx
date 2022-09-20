import { Receipt, MoneyRounded, Splitscreen, Check } from "@mui/icons-material";
import {
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Select,
  MenuItem,
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
import * as models from "../../../utils/models";
import "../../../utils/class_extension.ts";
import * as url from "../../../utils/urls";
import grey from "@mui/material/colors/grey";
import Box from "@mui/system/Box";

type Props = {
  open: boolean;
  handleClose: () => void;
  expenseId?: number;
  groupId: string;
};

const ViewSplitsModal = ({ open, handleClose, expenseId, groupId }: Props) => {
  const [splits, setSplits] = useState<any[]>([]);
  const [originalSplit, setOriginalSplit] = useState<any>(null);
  const [originalSum, setOriginalSum] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean[]>([]);
  const getSplitsByExpense = () => {
    if (expenseId !== null && groupId !== null) {
      fetch(`${url.api}/user/groups/${groupId}/expense/${expenseId}`)
        .then((res) => res.json())
        .then((splits) => {
          setSplits(splits);
          setOriginalSplit(splits);
          setOriginalSum(splits.reduce((a, b) => a + b.amount, 0));
          setIsEditing(splits.map(() => false));
        });
    }
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

  useEffect(() => {
    if (expenseId !== undefined && groupId !== undefined) getSplitsByExpense();
  }, [expenseId]);

  useEffect(() => {
    console.log(splits, "hi");
  }, [splits]);

  return (
    <ModalContent
      open={open}
      handleClose={handleClose}
      title={"Expense Details"}
    >
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
                sx={{ pr: 2 }}
                textAlign="right"
              >
                {splits[0].Expense.Payer.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid display="flex" container sx={{ pb: 2, pr: 2 }}>
            <Grid item xs={4}>
              <Typography variant="body1" color="text.primary" sx={{ py: 1 }}>
                Total Expense:
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ py: 1 }}
                textAlign="right"
              >
                {splits[0].Expense.amount}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <Grid
        sx={{ flex: 1, alignItems: "center" }}
        flexDirection="row"
        display="flex"
      >
        <Grid item xs>
          <Typography variant="h6" component="h2" color="background.default">
            View Splits{" "}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="caption" color={grey[400]}>
            (Edit by double clicking on the amount)
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <List>
        {splits.map((split, i) => (
          <ListItem sx={{ ml: 0, pl: 0, display: "flex" }}>
            <ListItemIcon
              sx={{
                display: "flex",
                flex: "0 0 66%",
                borderRadius: 2,
              }}
            >
              <Typography>{split.User.name.substring(0, 8)}</Typography>
            </ListItemIcon>
            {isEditing[i] === true ? (
              <Input
                sx={{
                  flex: "0 0 33%",
                }}
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
                width="100%"
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
      {originalSplit !== splits &&
        splits.reduce((a, b) => a + b.amount, 0) !== originalSum && (
          <Typography color="error.main" sx={{ mb: 2 }}>
            Amounts do not sum up to ${originalSum}
          </Typography>
        )}
      {originalSplit !== splits && (
        <Button
          variant="outlined"
          disabled={isEditing.some((x) => x)}
          onClick={() => updateSplits()}
        >
          Submit
        </Button>
      )}
    </ModalContent>
  );
};

export default ViewSplitsModal;
