import { Receipt } from "@mui/icons-material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, List, IconButton, Fab, TextField, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
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
  const router = useRouter();
  const { friendId, name } = router.query;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState<number | null>();
  const [description, setDescription] = useState<string>("");
  const [transactions, setTransactions] = useState<Array<FriendExpense>>([]);
  const [totalFigure, setTotalFigure] = useState<number>(0);

  const getTransactions = () => {
    fetch(`${url.api}/user/friends/${friendId}`)
      .then((res) => res.json())
      .then((transactions) => {
        const { userExpenses, friendExpenses } = transactions;
        const sortedMergedtransactions = [
          ...userExpenses,
          ...friendExpenses.map((expense: FriendExpense) => ({
            ...expense,
            amount: -expense.amount,
          })),
        ].sort((x, y) => x.timestamp - y.timestamp);
        setTransactions(sortedMergedtransactions);
        setTotalFigure(
          sortedMergedtransactions.reduce((acc, curr) => acc + curr.amount, 0)
        );
        console.log(sortedMergedtransactions);
      });
  };

  const createExpense = () => {
    fetch(`${url.api}/user/friends/${friendId}/expense?friendId=${friendId}`, {
      method: "PUT",
      body: JSON.stringify(amount),
    });
    setAmount(null);
    setDescription("");
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <ModalContent
        open={open}
        handleClose={handleClose}
        title="Add a transaction"
        subtitle={`Between you and ${name}`}
      >
        <>
          <TextField
            sx={{
              flex: "0 0 100%",
              my: 2,
              input: { color: "background.default" },
            }}
            type="text"
            name="transactionDescription"
            value={description}
            placeholder="Transaction description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            sx={{
              flex: "0 0 100%",
              input: { color: "background.default" },
            }}
            type="number"
            name="transactionAmount"
            value={amount}
            inputProps={{
              maxLength: 13,
              step: "1",
            }}
            placeholder="Amount you lent"
            onChange={(e) => setAmount(e.target.value.toCurrencyFormat())}
          />
          <Button
            variant="outlined"
            type="submit"
            sx={{ width: "33%", my: 2 }}
            onClick={createExpense}
          >
            Save
          </Button>
        </>
      </ModalContent>
      <Box sx={{ ml: -1.5, width: "100%", justifyContent: "flex-start" }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Box>
      {/* <TopAppBarNew title="Balance" /> */}
      <Typography variant="caption" sx={{ color: grey[400] }}>
        Transaction between {name}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: totalFigure < 0 ? "error.main" : "primary.main",
          fontWeight: 500,
        }}
      >
        {totalFigure < 0 ? "-" : "+"}${Math.abs(totalFigure)}
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 500, mt: 3 }}
      >
        Transaction
      </Typography>
      <List>
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
        className="fab--action"
        aria-label="add"
        variant="extended"
        onClick={() => handleOpen()}
      >
        <Receipt fontSize="medium" sx={{ color: "white", mr: 1 }} />
        <Typography color="white">Add Transaction</Typography>
      </Fab>
    </Box>
  );
};

export default FriendDetailsPage;
function AddFriendItem() {
  throw new Error("Function not implemented.");
}
