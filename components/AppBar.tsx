import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const TopAppBar = (props: { headerText: string }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="app-bar">
        <Toolbar>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            className="app-bar__text"
          >
            {props.headerText}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
