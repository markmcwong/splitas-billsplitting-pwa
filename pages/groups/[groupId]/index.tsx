import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import AvatarList from "../../../components/AvatarList";
import BottomAppBar from "../../../components/BottomAppBar";
import * as models from "../../../utils/models";
import { AppRoutesValues } from "../../../utils/urls";
import ArrowBack from "@mui/icons-material/ArrowBack";
import * as url from "../../../utils/urls";
import { Payment } from "@prisma/client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import TransactionItem from "../../../components/TransactionItem";
import List from "@mui/material/List";
import MoneyLabel from "../../../components/MoneyLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "./createExpenseModal";
import ViewSplitsModal from "./splitExpenseModal";

// const testUser: models.User = {
//   id: 1,
//   hasAccount: true,
//   name: "Test User",
//   email: "email.com",
//   session: null,
//   tokenId: 0,
// };

type GroupDetails = models.Group & {
  Expenses: models.Expense[];
  Payment: Payment[];
  Users: models.User[];
};

const GroupDetailsPage = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [splits, setSplits] = useState<any[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [openv2, setOpenv2] = useState(false);

  const [currentExpenseId, setCurrentExpenseId] = useState<
    number | undefined
  >();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenv2 = () => setOpenv2(true);
  const handleClosev2 = () => setOpenv2(false);
  const getSplitsRequired = () => {
    fetch(`${url.api}/user/groups/${groupId}/split`)
      .then((res) => res.json())
      .then((splits) => {
        setSplits(splits);
        console.log("splits: ", splits);
      });
  };

  const getGroupDetails = () => {
    fetch(`${url.api}/user/groups/${groupId}`)
      .then((res) => res.json())
      .then((groupDetails) => {
        setGroupDetails(groupDetails);
        console.log(groupDetails);
      });
  };

  useEffect(() => {
    getGroupDetails();
    getSplitsRequired();
  }, [open]);

  useEffect(() => {
    if (splits && groupDetails) {
      setTotal(
        groupDetails!.Payment.filter((x) => x.paidFromId == 1)
          .map((y) => y.amount)
          .reduce((a, b) => a + b, 0) -
          splits!.map((x) => x.amount).reduce((a, b) => a + b, 0)
      );
    }
  }, [splits, groupDetails]);

  return (
    <Box sx={{ minHeight: "100vh", pl: 3, py: 3 }} bgcolor="background.paper">
      {groupDetails && (
        <CustomModal
          open={open}
          handleClose={handleClose}
          users={groupDetails.Users}
          groupId={groupId as string}
        />
      )}
      {currentExpenseId && (
        <ViewSplitsModal
          open={openv2}
          handleClose={handleClosev2}
          expenseId={currentExpenseId}
          groupId={groupId as string}
        />
      )}
      <Box sx={{ ml: -1.5, width: "100%", justifyContent: "flex-start" }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Box>
      <Grid display="flex" flexDirection="row" container sx={{ mb: 4 }}>
        <Grid item xs={5} display="flex" flexDirection="column">
          <Box alignItems="flex-start">
            {groupDetails && splits && (
              <>
                <Typography variant="caption" sx={{ color: grey[400] }}>
                  Total Amount You {total > 0 ? "Lent" : "Owed"}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: total < 0 ? "error.main" : "primary.main",
                    fontWeight: 500,
                  }}
                >
                  {Math.abs(total)}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Divider light orientation="vertical" />
        </Grid>
        <Grid
          item
          xs={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box alignItems="flex-start">
            <Typography variant="caption" sx={{ color: grey[400] }}>
              Total Group Expense
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              {groupDetails &&
                groupDetails!.Expenses.map((y) => y.amount).reduce(
                  (a, b) => a + b,
                  0
                )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        sx={{ my: 2, color: "primary.main", fontWeight: 500 }}
      >
        Group Members
      </Typography>
      {groupDetails === null ? (
        <CircularProgress />
      ) : (
        <>
          <AvatarList friends={groupDetails.Users} />
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 500, mt: 3 }}
          >
            Expenses
          </Typography>
          <List>
            {groupDetails.Expenses.map((_transaction) => {
              return (
                <TransactionItem
                  date={new Date(_transaction.timestamp)}
                  rightContent={MoneyLabel(_transaction.amount)}
                  onClick={() => {
                    setCurrentExpenseId(_transaction.id);
                    handleOpenv2();
                  }}
                />
              );
            })}
          </List>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 500, mt: 3 }}
          >
            Payments
          </Typography>
          <List>
            {groupDetails.Payment.map((_transaction) => {
              return (
                <TransactionItem
                  date={new Date(_transaction.timestamp)}
                  rightContent={MoneyLabel(_transaction.amount)}
                  label={_transaction.PaidFrom.name}
                  // onClick={() => {
                  //   setCurrentExpenseId(_transaction.id);
                  //   handleOpenv2();
                  // }}
                />
              );
            })}
          </List>
        </>
      )}
      <BottomAppBar routeValue={AppRoutesValues.Groups} />
      <Fab
        color="primary"
        className="fab--action-offset"
        aria-label="add"
        onClick={() => handleOpen()}
      >
        <AddIcon fontSize="medium" sx={{ color: "white" }} />
      </Fab>
    </Box>
  );
};

export default GroupDetailsPage;
