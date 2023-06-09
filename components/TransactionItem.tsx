import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { Box, Typography } from "@mui/material";
import MoneyLabel from "./MoneyLabel";

type TransactionItemProps = {
  // friend: any;
  rightContent?: JSX.Element;
  color?: string;
  textColor?: string;
  date?: Date;
  label?: string;
  onClick?: () => void;
};

const TransactionItem = ({
  rightContent = MoneyLabel(21.54),
  color = "transparent",
  textColor = "black",
  label = "Transaction",
  date = new Date("2022 05-05 11:30PM"),
  onClick = () => {},
}: TransactionItemProps) => {
  return (
    <ListItem className="transaction-item" onClick={onClick}>
      <ListItemIcon className="transaction-item__date">
        <Typography>{date.getDate()}</Typography>
        <Typography>
          {date.toLocaleDateString("en-US", { month: "short" })}
        </Typography>
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={date.toLocaleString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
        })}
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
      {rightContent}
    </ListItem>
  );
};

export default TransactionItem;
