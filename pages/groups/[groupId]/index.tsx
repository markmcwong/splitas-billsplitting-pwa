import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import router from "next/router";
import React, { useState, useEffect } from "react";
import AvatarList from "../../../components/AvatarList";
import BottomAppBar from "../../../components/BottomAppBar";
import * as models from "../../../utils/models";
import { AppRoutesValues } from "../../../utils/urls";
import ArrowBack from "@mui/icons-material/ArrowBack";

const testUser: models.User = {
  id: 1,
  hasAccount: true,
  name: "Test User",
  email: "email.com",
  session: null,
  tokenId: 0,
};

const GroupDetailsPage = () => {
  const friends = [
    testUser,
    testUser,
    testUser,
    testUser,
    testUser,
    testUser,
    testUser,
    testUser,
  ];

  return (
    <Box sx={{ minHeight: "100vh", pl: 3, py: 3 }} bgcolor="background.paper">
      <Box sx={{ ml: -1.5, width: "100%", justifyContent: "flex-start" }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack fontSize="large" />
        </IconButton>
      </Box>
      <Grid display="flex" flexDirection="row" container sx={{ mb: 4 }}>
        <Grid item xs={5} display="flex" flexDirection="column">
          <Box alignItems="flex-start">
            <Typography variant="caption" sx={{ color: grey[400] }}>
              Total Bill
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              $1,243.00
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Divider light orientation="vertical" />
        </Grid>
        <Grid
          item
          xs={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box alignItems="flex-start">
            <Typography variant="caption" sx={{ color: grey[400] }}>
              Split to
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              4
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        sx={{ my: 2, color: "primary.main", fontWeight: 500 }}
      >
        Group Members
      </Typography>
      <AvatarList friends={friends} />
      <BottomAppBar routeValue={AppRoutesValues.Groups} />
    </Box>
  );
};

export default GroupDetailsPage;
