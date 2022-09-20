import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import { SessionProvider } from "next-auth/react";
import Layout from '../components/Layout';

// TODO: Properly set up themes, e.g. dark/light mode etc

const theme = createTheme({
  typography: {
    fontFamily: [
      "DM Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {
    mode: "light",
    primary: {
      main: "#6EBA97",
    },
    secondary: {
      main: "#114057",
    },
    background: {
      default: "#082341",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000dd",
    },
  },
});

function MyApp({ Component, pageProps, session}) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Layout>
    </SessionProvider>    
  );
}

export default MyApp;
