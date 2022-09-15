import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link from "next/link";

const ContactItem = (
  friend: any,
  rightContent?: JSX.Element,
  color: string = "transparent",
  textColor: string = "black"
) => {
  return (
    <Link href={`/friends/${friend.id}`}>
      <Grid bgcolor={color} display="flex" flexDirection="row" sx={{ my: 1 }}>
        <Grid display="flex" item container xs={1} sx={{ my: 1, mr: 3 }}>
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
            {friend.email}
          </Typography>
          <Typography variant="caption" sx={{ color: grey[500] }}>
            {friend.name}
          </Typography>
        </Grid>
        <Grid
          display="flex"
          flexDirection={"column"}
          item
          xs={1}
          justifyContent="center"
        >
          {rightContent}
        </Grid>
      </Grid>
    </Link>
  );
};

export default ContactItem;
