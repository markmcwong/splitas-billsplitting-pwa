import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const ContactItem = (
  name: string,
  email: string,
  color: string = "transparent",
  textColor: string = "black"
) => {
  return (
    <Grid bgcolor={color} container spacing={2}>
      <Grid display="flex" item container xs={1} sx={{ my: 1, mx: 2 }}>
        <Avatar
          sx={{ maxHeight: 45, maxWidth: 45 }}
          alt="name"
          src="https://via.placeholder.com/150.png"
        />
      </Grid>
      <Grid
        display="flex"
        flexDirection={"column"}
        item
        xs
        justifyContent="center"
      >
        <Typography variant="body2" sx={{ color: textColor }}>
          {email}
        </Typography>
        <Typography variant="caption" sx={{ color: grey[500] }}>
          {name}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ContactItem;
