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
import FriendModal from "../../../components/AddFriendModal";
import { Logout } from "@mui/icons-material";
import { check_cookie_by_name } from "../../../utils/class_extension";
import { Stack } from "@mui/material";

type GroupDetails = models.Group & {
  Expenses: models.Expense[];
  Payment: (Payment & { PaidFrom: models.User })[];
  Users: models.User[];
};

type SplitsType = models.Split & { Expense: models.Expense };

const StackedPriceLabel = (
  splits: SplitsType[],
  expense: models.Expense,
  currentUserId: string
) => {
  return (
    <Stack direction="row" alignItems="center">
      {MoneyLabel(
        splits.find(
          (x) =>
            x.expenseId == expense.id &&
            x.Expense.payerId != parseInt(currentUserId)
        )?.amount || 0
      )}
      <Typography className="text--grey">/</Typography>
      {MoneyLabel(expense.amount)}
    </Stack>
  );
};

const GroupDetailsPage = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [splits, setSplits] = useState<SplitsType[] | null>([]);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [openv2, setOpenv2] = useState(false);
  const [openv3, setOpenv3] = useState(false);
  const currentUserId = check_cookie_by_name("userId");

  const [currentExpenseId, setCurrentExpenseId] = useState<
    number | undefined
  >();

  const handleOpen = () => setOpen(true);
  const handleOpenv3 = () => setOpenv3(true);
  const handleClose = () => setOpen(false);
  const handleOpenv2 = () => setOpenv2(true);
  const handleClosev2 = () => setOpenv2(false);
  const handleClosev3 = () => setOpenv3(false);

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

  const kickFromGroup = (userId?: number) => {
    const postBody = {
      type: "kick",
      userId,
    };
    fetch(`${url.api}/user/groups/${groupId}`, {
      method: "POST",
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .then((data) => {
        getGroupDetails();
        getSplitsRequired();
      });
  };

  useEffect(() => {
    getGroupDetails();
    getSplitsRequired();
  }, [open, openv3, openv2]);

  useEffect(() => {
    if (splits && groupDetails) {
      setTotal(
        groupDetails!.Payment.filter((x) => x.paidFromId == 1)
          .map((y) => y.amount)
          .reduce((a, b) => a + b, 0) -
          splits!
            .map((x) =>
              x.Expense.payerId == parseInt(currentUserId!) ? 0 : x.amount
            )
            .reduce((a, b) => a + b, 0)
      );
    }
  }, [splits, groupDetails]);

  return (
    <Box bgcolor="background.paper" className="page__group--no-padding-right">
      {groupDetails && (
        <CustomModal
          open={open}
          handleClose={handleClose}
          users={groupDetails.Users}
          groupId={groupId as string}
        />
      )}
      <FriendModal
        open={openv3}
        handleClose={handleClosev3}
        callback={getGroupDetails}
        isUsedForGroup={true}
      />
      {currentExpenseId && (
        <ViewSplitsModal
          open={openv2}
          handleClose={handleClosev2}
          expenseId={currentExpenseId}
          groupId={groupId as string}
        />
      )}
      <>
        <Box className="action-bar--top-separated">
          <IconButton onClick={() => router.back()}>
            <ArrowBack fontSize="large" />
          </IconButton>

          <IconButton
            onClick={() => {
              kickFromGroup();
            }}
          >
            <Logout fontSize="large" />
          </IconButton>
        </Box>
        <Grid container className="margin__bottom--2 container--row">
          <Grid item xs={5} className="container--row">
            <Box alignItems="flex-start">
              {groupDetails && splits && (
                <>
                  <Typography variant="caption" className="text--light-grey">
                    Total Amount You {total > 0 ? "Lent" : "Owed"}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="text--semibolded"
                    color={total < 0 ? "error.main" : "primary.main"}
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
            flexDirection="column"
            className="container--align-centered"
          >
            <Box alignItems="flex-start">
              <Typography variant="caption" className="text--light-grey">
                Total Group Expense
              </Typography>
              <Typography
                variant="h4"
                className="text--semibolded"
                color="primary.main"
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
          className="text__subtitle"
          color="primary.main"
        >
          Group Members
        </Typography>
      </>
      {groupDetails === null ? (
        <CircularProgress />
      ) : (
        <>
          <AvatarList
            callback={() => {
              handleOpenv3();
            }}
            friends={groupDetails.Users}
            kickOut={(user) => {
              kickFromGroup(user.id);
              getGroupDetails();
            }}
          />
          <Typography
            variant="h6"
            className="text__subtitle"
            color="primary.main"
          >
            Expenses
          </Typography>
          <List className="container__expense--scrollable">
            {splits &&
              groupDetails &&
              groupDetails.Expenses.map((expense) => {
                return (
                  <TransactionItem
                    key={expense.id}
                    label={expense.description}
                    date={new Date(expense.timestamp)}
                    rightContent={StackedPriceLabel(
                      splits,
                      expense,
                      currentUserId!
                    )}
                    onClick={() => {
                      setCurrentExpenseId(expense.id);
                      handleOpenv2();
                    }}
                  />
                );
              })}
          </List>
          <Typography
            variant="h6"
            className="text__subtitle"
            color="primary.main"
          >
            Payments
          </Typography>
          <List className="container__flex-1-scrollable">
            {groupDetails.Payment.map((_transaction) => {
              return (
                <TransactionItem
                  key={_transaction.id}
                  date={new Date(_transaction.timestamp)}
                  rightContent={MoneyLabel(_transaction.amount)}
                  label={_transaction.PaidFrom.name}
                />
              );
            })}
          </List>
        </>
      )}
      <BottomAppBar routeValue={AppRoutesValues.Groups} />
      <Fab
        color="primary"
        className="fab--offset"
        aria-label="add"
        onClick={() => handleOpen()}
      >
        <AddIcon fontSize="medium" className="fab__icon--white" />
      </Fab>
    </Box>
  );
};

export default GroupDetailsPage;
