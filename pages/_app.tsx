import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Script from "next/script";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import * as urls from "../utils/urls";

const TRACKING_ID = "UA-242063911-1"; // Google Analytics Tracking ID

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

const webPushPublicKey = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;

type PwaData = {
  deferredInstallPrompt?: BeforeInstallPromptEvent;
  shouldAskForPushNotifications: boolean;
};

// let pwaData: PwaData = {
//   deferredInstallPrompt: undefined,
// };

// function setPwaData(newPwaData: PwaData) {
//   pwaData = newPwaData;
// }

function handleAppInstall(
  pwaData: PwaData,
  setPwaData: Dispatch<SetStateAction<PwaData>>
) {
  const deferredPrompt = pwaData.deferredInstallPrompt;
  if (!deferredPrompt) {
    console.error("Install prompt is not saved");
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the prompt");
    }

    setPwaData({
      ...pwaData,
      deferredInstallPrompt: undefined,
    });
  });
}

async function askPermissionAndSubscribePushNotification(
  pwaData: PwaData,
  setPwaData: Dispatch<SetStateAction<PwaData>>
) {
  if (typeof Notification === "undefined") {
    return;
  }

  const result = await Notification.requestPermission();
  setPwaData({
    ...pwaData,
    shouldAskForPushNotifications: false,
  });

  if (result !== "granted") {
    return;
  }
  const notification = new Notification("Welcome!");

  if (webPushPublicKey === undefined) {
    console.log("No web push public key exposed to browser");
    return;
  }

  const pushManager = (await navigator.serviceWorker.getRegistration())
    ?.pushManager;
  if (pushManager === undefined) {
    console.log("Service worker registration is undefined");
    return;
  }
  const subscription = await pushManager.getSubscription();
  if (subscription !== null) {
    return;
  }

  const newSubscription = await pushManager.subscribe({
    applicationServerKey: webPushPublicKey,
    userVisibleOnly: true,
  });

  const response = await fetch(`${urls.api}/user/notification`, {
    method: "PUT",
    body: JSON.stringify(newSubscription),
  });
  console.log(response.headers);
}

async function subscribeToWebPush() {}

type PwaContextType = {
  pwaData: PwaData;
  setPwaData: Dispatch<SetStateAction<PwaData>>;
  handleAppInstall: typeof handleAppInstall;
  askPermissionAndSubscribePushNotification: typeof askPermissionAndSubscribePushNotification;
};

export const PwaContext = createContext<PwaContextType | null>(null);

// https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent
/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [pwaData, setPwaData] = useState<PwaData>({
    deferredInstallPrompt: undefined,
    shouldAskForPushNotifications: false,
  });

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPwaData({
        ...pwaData,
        deferredInstallPrompt: e as BeforeInstallPromptEvent,
      });
      console.log("Stored install prompt");
    });
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      setPwaData({
        ...pwaData,
        shouldAskForPushNotifications: true,
      });
    }
  }, []);

  useEffect(() => {
    if (pwaData.shouldAskForPushNotifications) {
      askPermissionAndSubscribePushNotification(pwaData, setPwaData);
    }
  }, [pwaData]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${TRACKING_ID}');
        `}
      </Script>
      <ThemeProvider theme={theme}>
        <PwaContext.Provider
          value={{
            pwaData,
            setPwaData,
            handleAppInstall,
            askPermissionAndSubscribePushNotification,
          }}
        >
          <Component {...pageProps} />
        </PwaContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
