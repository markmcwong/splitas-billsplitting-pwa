import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import BottomAppBar from "../components/BottomAppBar";
import TopAppBar from "../components/AppBar";
import { AppRoutesValues } from "../utils/urls";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import * as url from "../utils/urls";
import SplashScreen from "../components/SplashScreen"


const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 4000)
  }, [])
  
  return (
    <div>
      {
        loading ? (
          <SplashScreen>

          </SplashScreen>
        ) : (
          <Box bgcolor="primary.main">
            <div>
              <TopAppBar />
              <BottomAppBar routeValue={AppRoutesValues.Activity} />
              <form action={`${url.api}/start`} method="GET">
                <button type="submit">Start with Google</button>
              </form>
            </div>
          </Box>
        )
      }
    </div>
  )};

export default Home;
