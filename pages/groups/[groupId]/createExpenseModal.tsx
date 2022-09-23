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
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import ModalContent from "../../../components/Modal";
import * as models from "../../../utils/models";
import * as ce from "../../../utils/class_extension";
import * as url from "../../../utils/urls";

type PropsType = {
  open: boolean;
  handleClose: () => void;
  users: models.User[];
  groupId: string;
};
interface UserAmountsType {
  [key: number]: number;
}

const CreateExpenseModal = ({
  open,
  handleClose,
  users,
  groupId,
}: PropsType) => {
  /* Lifecycle hooks start */
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [splitType, setSplitType] = useState<string>("equal");
  const [userAmounts, setUserAmounts] = useState<UserAmountsType>(
    users?.reduce(
      (map, obj) => ((map[obj.id] = 0), map),
      {} as UserAmountsType
    ) || {}
  );
  const [userAmountsSum, setUserAmountsSum] = useState<number>(0);

  useEffect(() => {
    setUserAmountsSum(
      Object.values(userAmounts).reduce((acc, curr) => acc + curr, 0)
    );
  }, [userAmounts]);
  /* Lifecycle hooks end */

  /* Network functions start */

  const createExpense = (amount: number, description: string) => {
    const len = Object.keys(userAmounts).length;
    // We do not include Group and Payer here, as these info are obtained from the query params and session token.
    const postBody: Prisma.ExpenseCreateInput = {
      amount,
      description,
      Splits: {
        createMany: {
          data: Object.keys(userAmounts).map((key) => {
            return {
              amount:
                splitType == "equal"
                  ? amount / len
                  : userAmounts[parseInt(key)],
              userId: parseInt(key),
            };
          }),
        },
      },
    };
    fetch(`${url.api}/user/groups/${groupId}/expense`, {
      method: "POST",
      body: JSON.stringify(postBody),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        handleClose();
        resetFields();
      });
  };
  /* Network functions end */

  /* helper function to reset state */
  const resetFields = () => {
    setAmount(0);
    setDescription("");
    setSplitType("equal");
    setUserAmounts(
      users.reduce(
        (map, obj) => ((map[obj.id] = 0), map),
        {} as UserAmountsType
      )
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
        {users &&
          (splitType == "exact"
            ? userAmountsSum != amount
            : userAmountsSum > amount) && (
            <Typography
              variant="caption"
              color="error.main"
              className="modal__validation-message"
            >
              Total amount is{" "}
              {splitType == "exact" ? "not equal to" : "greater than"} original
              expense: ${amount}
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
            splitType == "exact"
              ? userAmountsSum != amount
              : userAmountsSum > amount || description == "" || amount == 0
          }
        >
          Submit
        </Button>
      </>
    </ModalContent>
  );
};

export default CreateExpenseModal;
