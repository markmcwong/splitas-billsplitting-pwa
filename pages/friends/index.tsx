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
import ModalContent from "../../components/Modal";
import MoneyLabel from "../../components/MoneyLabel";

const AddFriendItem = (props: { callback: () => void }) => {
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
        <IconButton onClick={() => props.callback()}>
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

// mock User data
const testUser: models.User = {
  id: 1,
  hasAccount: true,
  name: "Test User",
  email: "email.com",
  session: null,
  tokenId: 0,
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Array<models.User>>([
    testUser,
    testUser,
  ]);

  const [searchString, setSearchString] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch(`${url.api}/user/friends`)
      .then((res) => res.json())
      .then((friends) => {
        console.log(friends);
        setFriends(friends);
      });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <ModalContent
        open={open}
        handleClose={handleClose}
        title="Add new friends"
      />
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
      />

      <AddFriendItem
        callback={() => {
          console.log("Modal Opened");
          handleOpen();
        }}
      />

      {friends
        .filter(
          (x) =>
            x.name.toLowerCase().includes(searchString.toLowerCase()) ||
            x.email.includes(searchString.toLowerCase())
        )
        .map((friend) => ContactItem(friend, MoneyLabel(10, 50), "friends"))}
      <BottomAppBar routeValue={AppRoutesValues.Friends} />
    </Box>
  );
}
