import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import { AppRoutesValues } from "../../utils/urls";
import * as models from "../../utils/models";
import * as url from "../../utils/urls";
import TextField from "@mui/material/TextField";
import ContactItem from "../../components/ContactItem";
import InputAdornment from "@mui/material/InputAdornment";
import { Add, Check, Input, List, Search } from "@mui/icons-material";
import TopAppBarNew from "../../components/TopBarNew";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import grey from "@mui/material/colors/grey";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import ModalContent from "../../components/Modal";
import MoneyLabel from "../../components/MoneyLabel";
import "../../utils/class_extension.ts";
import { ListItem, ListItemIcon } from "@mui/material";
import FriendModal from "../../components/AddFriendModal";

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
  tokenId: 0,
};

type friendWithExpense = {
  amount: number;
  user: models.User;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Array<friendWithExpense>>([
    // testUser,
    // testUser,
  ]);

  const [balance, setBalance] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const friendSummary = () => {
    fetch(`${url.api}/user/friends/summary`)
      .then((res) => res.json())
      .then((friends) => {
        setFriends(friends);
        setBalance(
          friends.reduce(
            (acc: number, cur: { amount: number }) => acc + cur.amount,
            0
          )
        );
      });
  };

  useEffect(() => {
    friendSummary();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }} bgcolor="background.paper">
      <FriendModal
        open={open}
        handleClose={handleClose}
        callback={friendSummary}
        isUsedForGroup={false}
        currentUsers={friends.map((x) => x.user)}
      />

      <Typography variant="caption" sx={{ color: grey[400] }}>
        {`Currently you ${balance < 0 ? "owed" : "lent"}`}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: balance < 0 ? "error.main" : "primary.main",
          fontWeight: 500,
        }}
      >
        ${Math.abs(balance).toFixed(2)}
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
            x.user.name.toLowerCase().includes(searchString.toLowerCase()) ||
            x.user.email.includes(searchString.toLowerCase())
        )
        .map((friend) =>
          ContactItem(friend.user, MoneyLabel(friend.amount, true), "friends")
        )}
      <BottomAppBar routeValue={AppRoutesValues.Friends} />
    </Box>
  );
}
