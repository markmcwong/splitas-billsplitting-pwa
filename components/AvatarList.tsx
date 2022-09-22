import { Avatar, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import * as models from "../utils/models";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import { Delete } from "@mui/icons-material";

type Props = {
  friends: models.User[];
  callback: () => void;
  kickOut: (user: models.User) => void;
};

const AvatarList = ({ friends, callback, kickOut }: Props) => {
  const [avatarClicked, setAvatarClicked] = useState<boolean[]>(
    friends.map((x) => false)
  );

  useEffect(() => {
    setAvatarClicked(friends.map((x) => false));
  }, [friends]);

  return (
    <Box
      className="container--full-width"
      display="flex"
      flexDirection={"row"}
      sx={{ overflowX: "scroll", minHeight: "75px" }}
    >
      <Box
        // item
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        sx={{
          mx: 1,
          maxHeight: 50,
          minWidth: 50,
          borderRadius: 50,
          border: "2px dashed grey",
        }}
        onClick={() => callback()}
      >
        <AddIcon sx={{ color: grey[500] }} fontSize="medium" />
      </Box>
      {friends.map((friend: models.User, i) => {
        return avatarClicked[i] ? (
          <Box
            // item
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            onClick={() => kickOut(friend)}
          >
            <Box
              // item
              display="flex"
              flexDirection={"column"}
              justifyContent="center"
              alignItems="center"
              sx={{
                mx: 1,
                maxHeight: 50,
                minWidth: 50,
                borderRadius: 50,
                width: 50,
                height: 50,
                border: "2px dashed grey",
              }}
            >
              <Delete sx={{ color: "error.main" }} fontSize="medium" />
            </Box>
            <Typography sx={{ color: "black" }}>
              {friend.name.split(" ")[0].substring(0, 8)}
            </Typography>
          </Box>
        ) : (
          // create an material UI avatar for each friend
          <Box
            // item
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            sx={{ mx: 1 }}
            onClick={() =>
              setAvatarClicked(avatarClicked.map((_, j) => i === j))
            }
          >
            <Avatar
              alt={friend.name}
              src="https://i.pravatar.cc/150"
              sx={{ width: 50, height: 50 }}
            />
            <Typography sx={{ color: "black" }}>
              {friend.name.split(" ")[0].substring(0, 8)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default AvatarList;
