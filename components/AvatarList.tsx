import { Avatar, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import * as models from "../utils/models";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";

type Props = {
  friends: models.User[];
};

const AvatarList = ({ friends }) => {
  return (
    <Box
      // container
      display="flex"
      flexDirection={"row"}
      // spacing={1.5}
      sx={{ width: "100%", overflow: "scroll" }}
    >
      <Box
        // item
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        sx={{
          mx: 1,
          maxHeight: 60,
          minWidth: 60,
          borderRadius: 50,
          border: "2px dashed grey",
        }}
      >
        <AddIcon sx={{ color: grey[500] }} fontSize="medium" />
      </Box>
      {friends.map((friend: models.User) => {
        return (
          // create an material UI avatar for each friend
          <Box
            // item
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            sx={{ mx: 1 }}
          >
            <Avatar
              alt={friend.name}
              src="https://via.placeholder.com/150.png"
              sx={{ width: 60, height: 60 }}
            />
            <Typography sx={{ color: "black" }}>
              {friend.name.split(" ")[0]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default AvatarList;
