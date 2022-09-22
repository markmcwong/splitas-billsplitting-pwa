import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import * as models from "../utils/models";

const EditNameDialog = ({
  open,
  handleClose,
  handleSubmit,
  user,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (name: string) => void;
  user: models.User;
}) => {
  const [name, setName] = useState<string>(user.name);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
            handleSubmit(name);
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNameDialog;
