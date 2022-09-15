import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { Box, Typography } from "@mui/material";

const RightContent = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      sx={{ textAlign: "end" }}
    >
      <Typography
        variant="h6"
        sx={{ color: "primary.main", display: "inline-block" }}
      >
        $10
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "primary.main", display: "inline-block" }}
      >
        .10
      </Typography>
    </Box>
  );
};
const TransactionItem = (
  friend: any,
  rightContent?: JSX.Element,
  color: string = "transparent",
  textColor: string = "black"
) => {
  return (
    <ListItem sx={{ ml: 0, pl: 0 }}>
      <ListItemIcon
        sx={{
          flexDirection: "column",
          alignItems: "center",
          mr: 2,
          borderRadius: 2,
          boxShadow: "3px 5px",
          border: "0.4px solid black",
        }}
      >
        <Typography>24</Typography>
        <Typography>Feb</Typography>
      </ListItemIcon>
      <ListItemText
        primary={`Line item`}
        secondary={"11:30 PM"}
        color="background.default"
        primaryTypographyProps={{
          color: "background.default",
          fontWeight: "medium",
          variant: "body2",
        }}
        secondaryTypographyProps={{
          variant: "caption",
        }}
      />
      {/* <Typography color="background.default">test</Typography> */}
      {RightContent()}
    </ListItem>
  );
};

export default TransactionItem;
