import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { type PostBody } from "../api/user/groups";
import * as models from "../../utils/models";
import * as url from "../../utils/urls";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ContactItem from "../../components/ContactItem";
import InputAdornment from "@mui/material/InputAdornment";
import { Add, Search } from "@mui/icons-material";
import grey from "@mui/material/colors/grey";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

type UserWithGroups = models.User & {
  Groups: models.Group[];
};

const fabStyle = {
  position: "absolute",
  bottom: 75,
  right: 16,
};

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

export default function GroupsPage() {
  const [userWithGroups, setUserWithGroups] = useState<UserWithGroups | null>(
    null
  );
  const [searchString, setSearchString] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fetchGroup = () => {
    fetch(`${url.api}/user/groups`)
      .then((res) => res.json())
      .then((g) => {
        setUserWithGroups(g);
      });
  };

  const ModalContent = () => {
    const [name, setName] = useState<string>("");
    function submitForm(e: React.MouseEvent<HTMLElement>) {
      e.preventDefault();
      const postBody: PostBody = {
        name,
      };
      fetch(`${url.api}/user/groups`, {
        method: "POST",
        body: JSON.stringify(postBody),
      });
      setTimeout(() => {
        setName(""); // a hack to force re-render
        fetchGroup();
        handleClose();
      }, 1000);
    }

    return (
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Create New Group
          </Typography>
          <TextField
            sx={{
              flex: "0 0 100%",
              my: 2,
              input: { color: "background.default" },
            }}
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="outlined"
            type="submit"
            sx={{ width: "33%" }}
            onClick={submitForm}
          >
            Create
          </Button>
        </Box>
      </Modal>
    );
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    display: "flex",
    flexDirection: "column" as "column",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <ModalContent />
      <BottomAppBar routeValue={AppRoutesValues.Groups} />
      {/* <TopAppBarNew title="Balance" /> */}
      <Typography variant="caption" sx={{ color: grey[400] }}>
        Groups Bill Balance
      </Typography>
      <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 500 }}>
        +$1,243.00
      </Typography>
      <TextField
        sx={{
          flex: "0 0 100%",
          borderRadius: 15,
          mt: 2,
          input: { color: "background.default" },
        }}
        fullWidth
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        id="outlined-basic"
        variant="outlined"
        style={{ color: "black" }}
        // size="small"
      />
      {userWithGroups?.Groups?.map((group) =>
        ContactItem(group, RightContent(), "groups")
      )}
      <BottomAppBar routeValue={AppRoutesValues.Groups} />
      <Fab
        color="primary"
        sx={fabStyle}
        aria-label="add"
        onClick={() => handleOpen()}
      >
        <AddIcon fontSize="medium" sx={{ color: "white" }} />
      </Fab>
    </Box>
  );
}
