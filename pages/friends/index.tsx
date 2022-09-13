import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import * as models from "../../utils/models";
import * as url from "../../utils/urls";

export default function FriendsPage() {
  const [friends, setFriends] = useState<Array<models.User>>([]);

  useEffect(() => {
    fetch(`${url.api}/friends`)
      .then((res) => res.json())
      .then((friends) => setFriends(friends));
  }, []);

  return (
    <Box bgcolor="primary.main">
      <TopAppBar />
      <div>Friends</div>
      <ol>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ol>

      <BottomAppBar routeValue={AppRoutesValues.Friends} />
    </Box>
  );
}
