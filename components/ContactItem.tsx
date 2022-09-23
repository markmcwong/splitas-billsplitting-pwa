import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link from "next/link";
import * as models from "../utils/models";
import { GroupSummary } from "../pages/groups";

type FriendWithProfileImage = Awaited<
  ReturnType<typeof models.getFriendsList>
>[number];

const ContactItem = (
  friend: FriendWithProfileImage | GroupSummary,
  rightContent?: JSX.Element,
  hrefPrefix: string = "",
  textColor: string = "black"
) => {
  console.log(friend);
  return (
    <Link
      href={
        friend.id > 0
          ? `/${hrefPrefix}/${friend.id}?name=${friend.name}`
          : `/${hrefPrefix}/#`
      }
    >
      <Grid className="contact-item__container">
        {"ProfileImage" in friend && (
          <Grid
            item
            container
            xs={1}
            className="contact-item__avatar-container"
          >
            <Avatar
              alt={`${friend.name}-avatar`}
              src={friend.ProfileImage?.imageString ?? ""}
              className="contact-item__avatar"
            />
          </Grid>
        )}
        <Grid className="contact-item__texts-container" item xs>
          <Typography
            variant="body2"
            sx={{ color: friend.id > 0 ? textColor : grey[400] }}
          >
            {"email" in friend && (friend as FriendWithProfileImage).email!}
          </Typography>
          <Typography
            variant={"email" in friend ? "caption" : "h6"}
            sx={{
              color:
                !("email" in friend) && friend.id > 0 ? textColor : grey[500],
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
