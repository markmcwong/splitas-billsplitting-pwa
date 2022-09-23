import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import BottomAppBar from "../components/BottomAppBar";
import TopAppBar from "../components/AppBar";
import { AppRoutesValues } from "../utils/urls";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import * as url from "../utils/urls";
import SplashScreen from "../components/SplashScreen";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">Splitas</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <div>
      {loading ? (
        <SplashScreen></SplashScreen>
      ) : (
        // <Box bgcolor="primary.main">
        //   <div>
        //     <form action={`${url.api}/start`} method="GET">
        //       <button type="submit">Start with Google</button>
        //     </form>
        //   </div>
        // </Box>

        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Image
              src="/Splitas.png"
              alt="Splitas logo"
              width={500}
              height={500}
            />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Your all-in-one bill splitting app
              </Typography>
              <form action={`${url.api}/start`} method="GET">
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Get Started With Google
                </Button>
              </form>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      )}
    </div>
  );
};

export default Home;
