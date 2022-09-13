import { useState, useMemo } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CallToActionIcon from "@mui/icons-material/CallToAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import {
  AppRoutesValues,
  AppRoutes,
  APP,
  GROUPS,
  FRIENDS,
  ACTIVITIES,
  PROFILE,
} from "../utils/urls";

const BottomAppBar = ({ routeValue = 0 }: { routeValue?: AppRoutesValues }) => {
  const [value, setValue] = useState(routeValue);
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      {
        label: `Groups`,
        icon: <PeopleIcon />,
        path: APP + GROUPS,
      },
      {
        label: `Friends`,
        icon: <PersonIcon />,
        path: APP + FRIENDS,
      },
      {
        label: `Activity`,
        icon: <CallToActionIcon />,
        path: APP + ACTIVITIES,
      },
      {
        label: `Profile`,
        icon: <AccountCircleIcon />,
        path: APP + PROFILE,
      },
    ],
    []
  );

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          router.push(menuItems[newValue].path);
        }}
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomAppBar;
