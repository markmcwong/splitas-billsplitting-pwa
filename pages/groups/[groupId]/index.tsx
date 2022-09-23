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
import CreateExpenseModal from "./createExpenseModal";
import ViewSplitsModal from "./splitExpenseModal";
import FriendModal from "../../../components/AddFriendModal";
import { Logout } from "@mui/icons-material";
import { check_cookie_by_name } from "../../../utils/class_extension";
import { Stack } from "@mui/material";
import { FriendType } from "../../../components/AvatarList";

type GroupDetailsType = models.Group & {
  Expenses: models.Expense[];
  Payment: (Payment & { PaidFrom: models.User })[];
  Users: FriendType[];
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
  /* Lifecycle hooks start */
  const router = useRouter();
  const { groupId } = router.query;
  const [groupDetails, setGroupDetails] = useState<GroupDetailsType | null>(
    null
  );
  const [splits, setSplits] = useState<SplitsType[] | null>([]);
  const [total, setTotal] = useState<number>(0);
  const [createModalOpenStatus, setCreateModalOpenStatus] = useState(false);
  const [viewModalStatus, setViewModalStatus] = useState(false);
  const [friendModalStatus, setFriendModalStatus] = useState(false);
  const currentUserId = check_cookie_by_name("userId");

  const [currentExpenseId, setCurrentExpenseId] = useState<
    number | undefined
  >();

  const createModalOpen = () => setCreateModalOpenStatus(true);
  const createModalClose = () => setCreateModalOpenStatus(false);
  const friendModalOpen = () => setFriendModalStatus(true);
  const friendModalClose = () => setFriendModalStatus(false);
  const viewModalOpen = () => setViewModalStatus(true);
  const viewModalClose = () => setViewModalStatus(false);

  useEffect(() => {
    getGroupDetails();
    getSplitsRequired();
  }, [createModalOpenStatus, friendModalStatus, viewModalStatus, router]);

  useEffect(() => {
    if (splits && groupDetails) {
      const othersPayingAmount = splits!
        .map((x) =>
          x.Expense.payerId == parseInt(currentUserId!) ? 0 : x.amount
        )
        .reduce((a, b) => a + b, 0);
      setTotal(
        groupDetails!.Payment.filter((x) => x.paidFromId == 1)
          .map((y) => y.amount)
          .reduce((a, b) => a + b, 0) - othersPayingAmount
      );
    }
  }, [splits, groupDetails]);

  /* Lifecycle hooks end */

  /* Network functions start */
  const getSplitsRequired = () => {
    fetch(`${url.api}/user/groups/${groupId}/split`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Something went wrong");
      })
      .then((splits) => {
        console.log(navigator);
        setSplits(splits);
      })
      .catch((err) => {
        if (!navigator.onLine) router.push(`${url.server}/_offline`);
      });
  };

  const getGroupDetails = () => {
    fetch(`${url.api}/user/groups/${groupId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Something went wrong");
      })
      .then((groupDetails) => {
        setGroupDetails(groupDetails);
      })
      .catch((err) => {
        if (!navigator.onLine) router.push(`${url.server}/_offline`);
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
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        getGroupDetails();
        getSplitsRequired();
      });
  };
  /* Network functions end */

  return (
    <Box bgcolor="background.paper" className="page__group--no-padding-right">
      {groupDetails && (
        <CreateExpenseModal
          open={createModalOpenStatus}
          handleClose={createModalClose}
          users={groupDetails.Users}
          groupId={groupId as string}
        />
      )}
      <FriendModal
        open={friendModalStatus}
        handleClose={friendModalClose}
        callback={getGroupDetails}
        isUsedForGroup={true}
      />
      {currentExpenseId && (
        <ViewSplitsModal
          open={viewModalStatus}
          handleClose={viewModalClose}
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
        <Grid container className="groups-details__info">
          <Grid item xs={5} className="container--row">
            <Box alignItems="flex-start">
              {groupDetails && splits && (
                <>
                  <Typography variant="caption" className="text--light-grey">
                    Total Amount You {total > 0 ? "Lent" : "Owed"}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="groups-page__figure"
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
                className="groups-page__figure"
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
        <CircularProgress className="progress" />
      ) : (
        <>
          <AvatarList
            callback={() => navigator.onLine && friendModalOpen()}
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
                      viewModalOpen();
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
        onClick={() => createModalOpen()}
      >
        <AddIcon fontSize="medium" className="fab__icon--white" />
      </Fab>
    </Box>
  );
};

export default GroupDetailsPage;
