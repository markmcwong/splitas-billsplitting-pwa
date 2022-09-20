import type { NextPage } from "next";
import Box from "@mui/material/Box";
import { signOut } from "next-auth/react";
// import BottomAppBar from "../components/BottomAppBar";
// import TopAppBar from "../components/AppBar";
// import { AppRoutesValues } from "../utils/urls";
// import Head from "next/head";
// import styles from "../styles/Home.module.css";
// import * as url from "../utils/urls";
// import { useSession, signIn, signOut } from "next-auth/client"

const Home: NextPage = () => {
  return (
    <Box bgcolor="primary.main">
      {/* <TopAppBar />
      <BottomAppBar routeValue={AppRoutesValues.Activity} />
      <form action={`${url.api}/start`} method="GET">
        <button type="submit">Start with Google</button>
      </form> */}
      <button onClick={() => signOut()}>Sign Out</button>
    </Box>
  );
};

export default Home;
