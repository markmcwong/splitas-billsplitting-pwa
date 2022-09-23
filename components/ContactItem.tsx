import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link from "next/link";

const ContactItem = (
  friend: any,
  rightContent?: JSX.Element,
  hrefPrefix: string = "",
  textColor: string = "black"
) => {
  return (
    <Link
      href={
        friend.id > 0
          ? `/${hrefPrefix}/${friend.id}?name=${friend.name}`
          : `/${hrefPrefix}/#`
      }
    >
      <Grid
        bgcolor="transparent"
        display="flex"
        flexDirection="row"
        sx={{ my: 1 }}
      >
        <Grid display="flex" item container xs={1} sx={{ my: 1, mr: 3 }}>
          <Avatar
            sx={{ maxHeight: 45, maxWidth: 45 }}
            alt="name"
            src="https://i.pravatar.cc/300"
          />
        </Grid>
        <Grid
          display="flex"
          flexDirection={"column"}
          item
          xs
          justifyContent="center"
        >
          <Typography
            variant="body2"
            sx={{ color: friend.id > 0 ? textColor : grey[400] }}
          >
            {friend.email != null && friend.email}
          </Typography>
          <Typography
            variant={friend.email != null ? "caption" : "h6"}
            sx={{ color: friend.email != null ? grey[500] : textColor }}
          >
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
