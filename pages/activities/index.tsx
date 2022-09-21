import type { NextPage } from "next";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import * as url from "../../utils/urls";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { Activity, ActivityType } from "@prisma/client";
import Link from "next/link";
import moment from "moment";
import {
  Divider,
  List,
  ListItem,
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
      .then((res) => res.json())
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
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {activities.filter((a) => displayedActivityTypesSet.has(a.type))
          .sort((a, b) => b.id - a.id)
          .map((item) => (
            <Fragment key={item.id}>
              <Link href={activityNavigation(item)} key={item.id}>
                <ListItem alignItems="flex-start" button>
                  <ListItemText
                    primary={
                      <Fragment>
                        {item.type === ActivityType.createGroup && (
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
