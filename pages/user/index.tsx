import type { NextPage } from "next";
import Link from "next/link";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { useEffect, useState, useContext } from "react";
import * as url from "../../utils/urls";
import * as models from "../../utils/models";
import { PwaContext } from "../_app";
import { Button } from "@mui/material";

export default function UserPage() {
  const [user, setUser] = useState<models.User | undefined>(undefined);
  useEffect(() => {
    fetch(`${url.api}/user`)
      .then((res) => res.json())
      .then((u) => setUser(u));
  }, []);

  const pwaContext = useContext(PwaContext);

  return (
    <Box bgcolor="primary.main">
      <TopAppBar />
      <div>Homepage</div>
      <div>
        Welcome, <span>{user?.email ?? ""}</span>!
      </div>
      {pwaContext?.pwaData?.deferredInstallPrompt && (
        <Button
          variant="contained"
          onClick={(e) =>
            pwaContext.handleAppInstall(
              pwaContext.pwaData,
              pwaContext.setPwaData
            )
          }
        >
          Install
        </Button>
      )}
      <Link href={`${url.server}/groups`}>
        <span style={{ color: "blue" }}>Groups</span>
      </Link>
      <br></br>
      <Link href={`${url.server}/friends`}>
        <span style={{ color: "blue" }}>Friends</span>
      </Link>
      <BottomAppBar routeValue={AppRoutesValues.Profile} />
    </Box>
  );
}
