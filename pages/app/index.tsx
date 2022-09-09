import type { NextPage } from "next";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../common/constants/appRoutes";

const AppPage: NextPage = () => {
  return (
    <Box bgcolor="primary.main">
      <TopAppBar />
      <BottomAppBar routeValue={AppRoutesValues.Activity}/>
    </Box>
  );
};

export default AppPage;
