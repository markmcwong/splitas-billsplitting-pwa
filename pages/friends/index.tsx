import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import { AppRoutesValues } from "../../utils/urls";
import * as models from "../../utils/models";
import * as url from "../../utils/urls";
import TextField from "@mui/material/TextField";
import ContactItem from "../../components/ContactItem";
import InputAdornment from "@mui/material/InputAdornment";
import { Add, Search } from "@mui/icons-material";
import TopAppBarNew from "../../components/TopBarNew";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import grey from "@mui/material/colors/grey";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";

const AddFriendItem = (callback: Function) => {
  return (
    <Grid container spacing={2}>
      <Grid
        display="flex"
        item
        container
        alignItems="center"
        xs={1}
        sx={{ my: 1, mr: 3 }}
      >
        <IconButton onClick={() => callback()}>
          <Add fontSize="large" />
        </IconButton>
      </Grid>
      <Grid display="flex" item xs alignItems="center" sx={{ my: 0 }}>
        <Typography variant="body2" sx={{ color: grey[500] }}>
          Add new friends
        </Typography>
      </Grid>
    </Grid>
  );
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

export default function FriendsPage() {
  const testUser: models.User = {
    id: 1,
    hasAccount: true,
    name: "Test User",
    email: "email.com",
    session: null,
    tokenId: 0,
  };

  const [friends, setFriends] = useState<Array<models.User>>([
    testUser,
    testUser,
    testUser,
  ]);

  const [searchString, setSearchString] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ModalContent = () => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
        </Box>
      </Modal>
    );
  };
  useEffect(() => {
    fetch(`${url.api}/user/friends`)
      .then((res) => {
        res.json();
        console.log(res);
      })
      .then(
        (friends) => console.log(friends)
        //setFriends(friends)
      );
  }, []);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <ModalContent />
      {/* <TopAppBarNew title="Balance" /> */}
      <Typography variant="caption" sx={{ color: grey[400] }}>
        Friends Bill Balance
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
      {AddFriendItem(() => {
        console.log("Modal Opened");
        handleOpen();
      })}
      {friends
        .filter(
          (x) =>
            x.name.toLowerCase().includes(searchString.toLowerCase()) ||
            x.email.includes(searchString.toLowerCase())
        )
        .map((friend) => ContactItem(friend, RightContent(), "friends"))}
      <BottomAppBar routeValue={AppRoutesValues.Friends} />
    </Box>
  );
}
