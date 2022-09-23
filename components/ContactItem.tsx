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
      <Grid className="contact-item__container">
        <Grid item container xs={1} className="contact-item__avatar-container ">
          <Avatar
            className="contact-item__avatar"
            alt={`${friend.name}-avatar`}
            src="https://i.pravatar.cc/300"
          />
        </Grid>
        <Grid className="contact-item__texts-container" item xs>
          <Typography
            variant="body2"
            sx={{ color: friend.id > 0 ? textColor : grey[400] }}
          >
            {friend.email != null && friend.email}
          </Typography>
          <Typography
            variant={friend.email != null ? "caption" : "h6"}
            sx={{
              color:
                friend.email == null && friend.id > 0 ? textColor : grey[500],
            }}
          >
            {friend.name}
          </Typography>
        </Grid>
        <Grid className="contact-item__content" item xs={1}>
          {rightContent}
        </Grid>
      </Grid>
    </Link>
  );
};

export default ContactItem;
