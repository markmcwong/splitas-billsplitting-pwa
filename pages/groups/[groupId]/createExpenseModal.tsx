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
import "../../../utils/class_extension.ts";
import * as url from "../../../utils/urls";

type Props = {
  open: boolean;
  handleClose: () => void;
  users: models.User[];
  groupId: string;
};

const CustomModal = ({ open, handleClose, users, groupId }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [splitType, setSplitType] = useState<string>("split");
  const [userAmounts, setUserAmounts] = useState<Object>(
    users.reduce((map, obj) => ((map[obj.id] = 0), map), {})
  );

  const createExpense = (
    amount: number,
    description: string
    // splitInput: { amount: number; userId: number }[]
  ) => {
    const postBody = {
      amount,
      description,
    };
    fetch(`${url.api}/user/groups/${groupId}/expense`, {
      method: "PUT",
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .then((data) => {
        const len = Object.keys(users).length;
        const putBodys: {
          amount: number;
          userId: number;
          expenseId: number;
        }[] = Object.keys(userAmounts).map((key) => {
          console.log(users);
          return {
            userId: parseInt(key),
            amount:
              (userAmounts[key] as number) == 0
                ? amount / len
                : parseFloat(userAmounts[key]),
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
    setSplitType("split");
    setUserAmounts(users.reduce((map, obj) => ((map[obj.id] = 0), map), {}));
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
            flex: "0 0 100%",
            borderRadius: 15,
            mt: 2,
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
        />
        <TextField
          sx={{
            flex: "0 0 100%",
            borderRadius: 15,
            mt: 2,
            input: { color: "background.default" },
          }}
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value.toCurrencyFormat())}
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
        <Grid container alignItems="center" sx={{ py: 2 }}>
          <Grid item xs>
            <Typography variant="body1" color="background.default">
              Paid by you and split
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
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
          ) != amount && (
            <Typography
              variant="caption"
              color="error"
              sx={{ lineHeight: 1, mt: 2 }}
            >
              Amounts do not sum up to expense: ${amount}
            </Typography>
          )}
        {splitType == "exact" &&
          users &&
          users.map((user) => (
            <ListItem sx={{ ml: 0, pl: 0 }}>
              <ListItemIcon
                sx={{
                  mr: 2,
                  display: "flex",
                  flex: "0 0 66%",
                  borderRadius: 2,
                }}
              >
                <Typography>{user.name.substring(0, 8)}</Typography>
                {/* <Typography>
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </Typography> */}
              </ListItemIcon>
              <Input
                sx={{
                  flex: "0 0 33%",
                  // borderRadius: 15,
                }}
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
                // size="small"
              />
            </ListItem>
          ))}

        <Button
          variant="outlined"
          type="submit"
          onClick={() => createExpense(amount, description)}
          sx={{ width: "33%", mt: 2 }}
          disabled={
            Object.values(userAmounts).reduce(
              (partialSum, a) => partialSum + a,
              0
            ) != amount && splitType == "exact"
          }
        >
          Submit
        </Button>
      </>
    </ModalContent>
  );
};

export default CustomModal;
