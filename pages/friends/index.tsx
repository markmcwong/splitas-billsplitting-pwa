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
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MoneyLabel from "../../components/MoneyLabel";
import "../../utils/class_extension.ts";
import FriendModal from "../../components/AddFriendModal";

type friendWithExpense = {
  amount: number;
  user: models.User;
};

const AddFriendItem = (props: { callback: () => void }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={1} className="list-item__icon-container">
        <IconButton onClick={() => props.callback()}>
          <Add fontSize="large" />
        </IconButton>
      </Grid>
      <Grid item xs className="container--align-centered">
        <Typography variant="body2" className="text--grey">
          Add new friends
        </Typography>
      </Grid>
    </Grid>
  );
};

export default function FriendsPage() {
  /* lifecycle hooks starts */
  const [friends, setFriends] = useState<Array<friendWithExpense>>([]);
  const [balance, setBalance] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    friendSummary();
  }, []);
  /* lifecycle ends starts */

  /* network function starts */
  const friendSummary = () => {
    fetch(`${url.api}/user/friends/summary`)
      .then((res) => res.json())
      .then((friends) => {
        if (typeof friends !== "string" && friends.length > 0) {
          setFriends(friends);
          setBalance(
            friends.reduce(
              (acc: number, cur: { amount: number }) => acc + cur.amount,
              0
            )
          );
        } else {
          setFriends([]);
          setBalance(0);
        }
      });
  };
  /* network function ends */

  return (
    <Box bgcolor="background.paper" className="page">
      <FriendModal
        open={open}
        handleClose={handleClose}
        callback={friendSummary}
        isUsedForGroup={false}
        currentUsers={friends.map((x) => x.user)}
      />

      <Typography variant="caption" className="text--light-grey">
        {`Currently you ${balance < 0 ? "owed" : "lent"}`}
      </Typography>
      <Typography
        variant="h4"
        className="friend-page__figure"
        sx={{
          color: balance < 0 ? "error.main" : "primary.main",
        }}
      >
        ${Math.abs(balance).toFixed(2)}
      </Typography>
      <TextField
        sx={{
          input: { color: "background.default" },
        }}
        fullWidth
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        className="form__input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />

      <AddFriendItem callback={handleOpen} />

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
