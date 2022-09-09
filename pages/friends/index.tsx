import { useState, useEffect } from "react";

import * as models from "../../utils/models";
import * as url from "../../utils/url";

export default function FriendsPage() {
  const [friends, setFriends] = useState<Array<models.User>>([]);

  useEffect(() => {
    fetch(`${url.api}/friends`)
      .then((res) => res.json())
      .then((friends) => setFriends(friends));
  }, []);

  return (
    <>
      <div>Friends</div>
      <ol>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ol>
    </>
  );
}
