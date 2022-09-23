import { Avatar, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import * as models from "../utils/models";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

/* type definition starts */

type Props = {
  friends: models.User[];
  callback: () => void;
  kickOut: (user: models.User) => void;
};

/* type definition ends */

const AvatarList = ({ friends, callback, kickOut }: Props) => {
  /* Lifecycle hook starts */

  const [avatarClicked, setAvatarClicked] = useState<boolean[]>(
    friends.map((x) => false)
  );

  useEffect(() => {
    setAvatarClicked(friends.map((x) => false));
  }, [friends]);

  /* Lifecycle hook ends */

  return (
    <Box className="avatar-list__container">
      <Box className="avatar-list__add-button" onClick={() => callback()}>
        <AddIcon className="avatar-list__add-icon" fontSize="medium" />
      </Box>
      {friends.map((friend: models.User, i: number) => {
        return avatarClicked[i] ? (
          <Box
            className="container--column container--centered"
            onClick={() => kickOut(friend)}
          >
            <Box className="avatar-list__delete-container">
              <Delete sx={{ color: "error.main" }} fontSize="medium" />
            </Box>
            <Typography className="avatar-list__label">
              {friend.name.split(" ")[0].substring(0, 8)}
            </Typography>
          </Box>
        ) : (
          // create an material UI avatar for each friend
          <Box
            // item
            className="container--column container--centered margin__horizontal--1"
            onClick={() =>
              setAvatarClicked(avatarClicked.map((_, j) => i === j))
            }
          >
            <Avatar
              alt={friend.name}
              src="https://i.pravatar.cc/150"
              className="avatar-list__avatar"
            />
            <Typography className="avatar-list__label">
              {friend.name.split(" ")[0].substring(0, 8)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default AvatarList;
