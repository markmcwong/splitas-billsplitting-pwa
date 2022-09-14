import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
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

const AddFriendItem = () => {
  return (
    <Grid container spacing={2}>
      <Grid
        display="flex"
        item
        container
        alignItems="center"
        xs={1}
        sx={{ my: 1, mx: 2 }}
      >
        <IconButton>
          <Add />
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

export default function FriendsPage() {
  const testUser: models.User = {
    id: 1,
    hasAccount: true,
    name: "Test User",
    email: "email.com",
    session: null,
    tokenId: 0,
  };

  const [friends, setFriends] = useState<Array<models.User>>([testUser]);

  // useEffect(() => {
  //   fetch(`${url.api}/friends`)
  //     .then((res) => res.json())
  //     .then((friends) => setFriends(friends));
  // }, []);

  return (
    <Box sx={{ minHeight: "100vh" }} bgcolor="background.paper">
      <TopAppBarNew title="Friends">
        <TextField
          sx={{ flex: "0 0 100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          variant="standard"
          size="small"
        />
      </TopAppBarNew>
      {AddFriendItem()}
      {friends.map((friend) => ContactItem(friend.name, friend.email))}
      <BottomAppBar routeValue={AppRoutesValues.Friends} />
    </Box>
  );
}
