import { Receipt, MoneyRounded, Splitscreen } from "@mui/icons-material";
import {
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Select,
  MenuItem,
  ListItem,
  ListItemIcon,
  Input,
  Button,
  Divider,
  List,
} from "@mui/material";
import { useEffect, useState } from "react";
import ModalContent from "../../../components/Modal";
import * as models from "../../../utils/models";
import "../../../utils/class_extension.ts";
import * as url from "../../../utils/urls";

type Props = {
  open: boolean;
  handleClose: () => void;
  expenseId?: number;
  groupId: string;
};

const ViewSplitsModal = ({ open, handleClose, expenseId, groupId }: Props) => {
  const [splits, setSplits] = useState<any[]>([]);
  const getSplitsByExpense = () => {
    if (expenseId !== null && groupId !== null) {
      fetch(`${url.api}/user/groups/${groupId}/expense/${expenseId}`)
        .then((res) => res.json())
        .then((splits) => {
          setSplits(splits);
        });
    }
  };

  useEffect(() => {
    if (expenseId !== undefined && groupId !== undefined) getSplitsByExpense();
  }, [expenseId]);

  return (
    <ModalContent open={open} handleClose={handleClose} title={"View splits"}>
      <List>
        {splits.map((split) => (
          <ListItem sx={{ ml: 0, pl: 0 }}>
            <ListItemIcon
              sx={{
                mr: 2,
                display: "flex",
                flex: "0 0 66%",
                borderRadius: 2,
              }}
            >
              <Typography>{split.User.name.substring(0, 8)}</Typography>
            </ListItemIcon>
            <Typography color="text.primary">{split.amount}</Typography>
          </ListItem>
        ))}
      </List>
    </ModalContent>
  );
};

export default ViewSplitsModal;
