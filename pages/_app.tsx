import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
