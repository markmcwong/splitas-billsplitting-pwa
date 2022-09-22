import { Receipt, MoneyRounded } from "@mui/icons-material";
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
} from "@mui/material";
import { useState } from "react";
import ModalContent from "../../../components/Modal";
import * as models from "../../../utils/models";
import * as ce from "../../../utils/class_extension";
import * as url from "../../../utils/urls";

type Props = {
  open: boolean;
  handleClose: () => void;
  users: models.User[];
  groupId: string;
};
interface UserAmounts {
  [key: number]: number;
}

const CustomModal = ({ open, handleClose, users, groupId }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [splitType, setSplitType] = useState<string>("equal");
  const [userAmounts, setUserAmounts] = useState<UserAmounts>(
    users?.reduce((map, obj) => ((map[obj.id] = 0), map), {} as UserAmounts) ||
      {}
  );

  const createExpense = (amount: number, description: string) => {
    const postBody = {
      amount,
      description,
    };
    fetch(`${url.api}/user/groups/${groupId}/expense`, {
      method: "PUT",
      body: JSON.stringify(postBody),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        const len = Object.keys(users).length;
        const putBodys: {
          amount: number;
          userId: number;
          expenseId: number;
        }[] = Object.keys(userAmounts).map((key) => {
          return {
            userId: parseInt(key),
            amount:
              splitType == "equal" ? amount / len : userAmounts[parseInt(key)],
            expenseId: data.id,
          };
        });

        fetch(`${url.api}/user/groups/${groupId}/split`, {
          method: "PUT",
          body: JSON.stringify(putBodys),
        }).then((res) => {
          handleClose();
          resetFields();
        });
      });
  };

  const resetFields = () => {
    setAmount(0);
    setDescription("");
    setSplitType("equal");
    setUserAmounts(
      users.reduce((map, obj) => ((map[obj.id] = 0), map), {} as UserAmounts)
    );
  };

  return (
    <ModalContent
      open={open}
      handleClose={() => {
        resetFields();
        handleClose();
      }}
      title="Add new expense"
    >
      <>
        <TextField
          sx={{
            input: { color: "background.default" },
          }}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Expense description"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Receipt />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          variant="outlined"
          className="form__input"
        />
        <TextField
          sx={{
            input: { color: "background.default" },
          }}
          fullWidth
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount((e.target.value as string).toCurrencyFormat())
          }
          className="form__input"
          placeholder="Amount"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MoneyRounded />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          variant="outlined"
        />
        <Grid container alignItems="center" className="padding__vertical-2">
          <Grid item xs>
            <Typography variant="body1" color="background.default">
              Paid by you and split
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              size="small"
              label="Split Type"
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
            >
              <MenuItem value={"equal"}>Equally</MenuItem>
              <MenuItem value={"exact"}>by exact amount</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Divider />
        {splitType == "exact" &&
          users &&
          Object.values(userAmounts).reduce(
            (partialSum, a) => partialSum + a,
            0
          ) > amount && (
            <Typography
              variant="caption"
              color="error.main"
              className="modal__validation-message"
            >
              Total amount is greater than original expense: ${amount}
            </Typography>
          )}
        {splitType == "equal" && (
          <Typography
            variant="caption"
            className="modal__validation-message text--grey"
          >
            You are paying: ${amount / Object.keys(userAmounts).length}
          </Typography>
        )}
        {splitType == "exact" &&
          users &&
          users.map((user) => (
            <ListItem sx={{ ml: 0, pl: 0 }} key={user.id}>
              <ListItemIcon
                sx={{
                  mr: 2,
                  display: "flex",
                  flex: "0 0 66%",
                  borderRadius: 2,
                }}
              >
                <Typography>{user.name.substring(0, 8)}</Typography>
              </ListItemIcon>
              <Input
                className="container--two-third-width"
                type="number"
                value={userAmounts[user.id] as number}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                onChange={(e) =>
                  setUserAmounts({
                    ...userAmounts,
                    [user.id]: e.target.value.toCurrencyFormat(),
                  })
                }
                placeholder="Amount"
              />
            </ListItem>
          ))}

        <Button
          variant="outlined"
          type="submit"
          onClick={() => createExpense(amount, description)}
          className="form__submit-button--full-width"
          disabled={
            (Object.values(userAmounts).reduce(
              (partialSum, a) => partialSum + a,
              0
            ) > amount &&
              splitType == "exact") ||
            description == "" ||
            amount == 0
          }
        >
          Submit
        </Button>
      </>
    </ModalContent>
  );
};

export default CustomModal;
