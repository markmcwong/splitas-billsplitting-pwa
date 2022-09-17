import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

type Props = {
  title: string;
  children?: JSX.Element;
};

const TopAppBarNew = ({ title, children }: Props) => {
  return (
    <Box bgcolor="primary.main" sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Typography
          variant="h6"
          textAlign={"center"}
          component="div"
          sx={{ color: "background.paper", pt: 1, fontFamily: "Helvetica" }}
        >
          {title}
        </Typography>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBarNew;
