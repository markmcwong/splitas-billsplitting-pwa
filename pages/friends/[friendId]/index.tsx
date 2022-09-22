import { Delete, Receipt } from "@mui/icons-material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, List, IconButton, Fab, TextField, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ModalContent from "../../../components/Modal";
import TransactionItem from "../../../components/TransactionItem";
import * as url from "../../../utils/urls";
import { type FriendExpense } from "@prisma/client";
import MoneyLabel from "../../../components/MoneyLabel";
import "../../../utils/class_extension.ts";

const FriendDetailsPage = () => {
  /* lifecycle hooks starts */
  const router = useRouter();
  const { friendId, name } = router.query;
  const [open, setOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | null>();
  const [transactions, setTransactions] = useState<Array<FriendExpense>>([]);
  const [totalFigure, setTotalFigure] = useState<number>(0);

  useEffect(() => {
    getTransactions();
  }, []);

  /* lifecycle hooks ends */

  /* helper method starts */
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /* helper method ends */

  /* network functions starts */
  const getTransactions = () => {
    fetch(`${url.api}/user/friends/${friendId}`)
      .then((res) => res.json())
      .then((transactions) => {
        const { userExpenses, friendExpenses } = transactions;
        const mergedTransactionsSortedInTime = [
          ...userExpenses,
          ...friendExpenses.map((expense: FriendExpense) => ({
            ...expense,
            amount: -expense.amount,
          })),
        ].sort((x, y) => x.timestamp - y.timestamp);
        setTransactions(mergedTransactionsSortedInTime);
        setTotalFigure(
          mergedTransactionsSortedInTime.reduce(
            (acc, curr) => acc + curr.amount,
            0
          )
        );
      });
  };

  const deleteFriend = () => {
    fetch(`${url.api}/user/friends/${friendId}?friendId=${friendId}`, {
      method: "DELETE",
    }).then((res) => {
      router.back();
    });
  };

  const createExpense = () => {
    fetch(`${url.api}/user/friends/${friendId}/expense?friendId=${friendId}`, {
      method: "PUT",
      body: JSON.stringify(amount),
    });
    setAmount(null);
    handleClose();
    getTransactions();
  };

  /* network functions ends */

  return (
    <Box bgcolor="background.paper" className="page">
      <ModalContent
        open={open}
        handleClose={handleClose}
        title="Add a transaction"
        subtitle={`Between you and ${name}`}
      >
        <>
          <TextField
            className="container__item--full-flex"
            sx={{
              input: { color: "background.default" },
            }}
            type="number"
            name="transactionAmount"
            value={amount}
            inputProps={{
              maxLength: 10,
              step: "1",
            }}
            placeholder="Amount you lent"
            onChange={(e) =>
              setAmount(parseFloat(parseFloat(e.target.value).toFixed(2)))
            }
          />
          <Button
            variant="outlined"
            type="submit"
            className="container--full-width margin__vertical--2"
            onClick={createExpense}
          >
            Save
          </Button>
        </>
      </ModalContent>
      <Box className="action-bar--top-separated">
        <IconButton onClick={() => router.back()}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <IconButton onClick={() => deleteFriend()}>
          <Delete fontSize="large" />
        </IconButton>
      </Box>
      <Typography variant="caption" className="text--light-grey">
        Transaction between {name}
      </Typography>
      <Typography
        variant="h4"
        className="text--semibolded"
        sx={{
          color: totalFigure < 0 ? "error.main" : "primary.main",
        }}
      >
        {totalFigure < 0 ? "-" : "+"}${Math.abs(totalFigure)}
      </Typography>

      <Typography
        variant="h6"
        className="margin__top--3 text--semibolded"
        sx={{ color: "primary.main" }}
      >
        Transaction
      </Typography>
      <List className="container__flex-1-scrollable">
        {transactions &&
          transactions.map((_transaction) => (
            <TransactionItem
              date={new Date(_transaction.timestamp)}
              rightContent={MoneyLabel(_transaction.amount, true)}
              key={_transaction.id}
            />
          ))}
      </List>
      <Fab
        color="primary"
        className="fab"
        aria-label="add"
        variant="extended"
        onClick={() => handleOpen()}
      >
        <Receipt
          fontSize="medium"
          className="fab__icon--white margin__right--1"
        />
        <Typography className="text--white">Add Transaction</Typography>
      </Fab>
    </Box>
  );
};

export default FriendDetailsPage;
