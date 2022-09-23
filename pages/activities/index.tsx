import type { NextPage } from "next";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import * as url from "../../utils/urls";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { Activity, ActivityType } from "@prisma/client";
import GroupIcon from "@mui/icons-material/Group";
import PaymentsIcon from "@mui/icons-material/Payments";

import Link from "next/link";
import moment from "moment";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";

// Types of activities displayed
// createGroup Yes
// updateGroup Yes
// leaveGroup No?
// deleteGroup Yes?
// createPayment Yes
// createExpense Yes
// createFriend No
// updateFriend No
// deleteFriend No
// updateUser No
const displayedActivityTypesSet = new Set<ActivityType>([
  ActivityType.createGroup,
  ActivityType.updateGroup,
  ActivityType.deleteGroup,
  ActivityType.createPayment,
  ActivityType.createExpense,
]);

// const dummyActivitys: Activity[] = [
//   {
//     id: 1,
//     userId: 1,
//     type: ActivityType.createGroup,
//     groupId: 1,
//     paymentId: null,
//     expenseId: null,
//     friendId: 1,
//     description: "Test Description (Group)",
//     timestamp: new Date(2022, 8, 10),
//   },
//   {
//     id: 2,
//     userId: 1,
//     type: ActivityType.createExpense,
//     groupId: null,
//     paymentId: null,
//     expenseId: 1,
//     friendId: null,
//     description: "Test Description (Expense)",
//     timestamp: new Date(2022, 8, 15),
//   },
//   {
//     id: 3,
//     userId: 1,
//     type: ActivityType.createPayment,
//     groupId: 1,
//     paymentId: 1,
//     expenseId: null,
//     friendId: null,
//     description: "Test Description (Payment)",
//     timestamp: new Date(2022, 8, 20),
//   },
// ];

// Basically routes to another page only if there's a group or friend associated with the activity itself
const activityNavigation = (activity: Activity) => {
  if (activity.groupId !== null) {
    return `/groups/${activity.groupId}`;
  }
  if (activity.friendId !== null) {
    return `/friends/${activity.friendId}`;
  }
  return "";
};

const AppPage: NextPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const getRelevantActivities = async () => {
    await fetch(`${url.api}/user/activities`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((activities) => {
        console.log(activities); // TODO: Remove
        setActivities(activities);
      });
  };

  useEffect(() => {
    getRelevantActivities();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }} bgcolor="background.paper">
      <TopAppBar headerText="Activity" />
<<<<<<< HEAD
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
=======
      <List
        className="container--full-width"
        sx={{ bgcolor: "background.paper" }}
      >
>>>>>>> d3e026ff6b45ff5db95fa0d4ace0868ea11c3a61
        {activities
          .filter((a) => displayedActivityTypesSet.has(a.type))
          .sort((a, b) => b.id - a.id)
          .map((item) => (
            <Fragment key={item.id}>
              <Link href={activityNavigation(item)} key={item.id}>
                <ListItem alignItems="flex-start" button>
                  <ListItemAvatar>
                    <Avatar>
                      {(item.type === ActivityType.createGroup ||
                        item.type === ActivityType.updateGroup ||
                        item.type === ActivityType.deleteGroup) && (
                        <GroupIcon />
                      )}
                      {(item.type === ActivityType.createPayment ||
                        item.type === ActivityType.createExpense) && (
                        <PaymentsIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Fragment>
                        {(item.type === ActivityType.createGroup ||
                          item.type === ActivityType.updateGroup ||
                          item.type === ActivityType.deleteGroup) && (
                          <Typography fontWeight="medium" color="black">
                            {item.description}
                          </Typography>
                        )}
                        {item.type === ActivityType.createExpense && (
                          <Typography fontWeight="medium" color="red">
                            {item.description}
                          </Typography>
                        )}
                        {item.type === ActivityType.createPayment && (
                          <Typography fontWeight="medium" color="green">
                            {item.description}
                          </Typography>
                        )}
                      </Fragment>
                    }
                    secondary={moment(item.timestamp).fromNow()}
                  />
                </ListItem>
              </Link>
              <Divider />
            </Fragment>
          ))}
        <ListItem alignItems="flex-start"></ListItem>
        <ListItem alignItems="flex-start"></ListItem>
      </List>

      <BottomAppBar routeValue={AppRoutesValues.Activity} />
    </Box>
  );
};

export default AppPage;
