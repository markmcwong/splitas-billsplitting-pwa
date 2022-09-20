import type { NextPage } from "next";
import Link from "next/link";
import Box from "@mui/material/Box";
import BottomAppBar from "../../components/BottomAppBar";
import TopAppBar from "../../components/AppBar";
import { AppRoutesValues } from "../../utils/urls";
import { useEffect, useState } from "react";
import * as url from "../../utils/urls";
import * as models from "../../utils/models";
import { signOut } from "next-auth/react";
export default function UserPage() {
  const [user, setUser] = useState<models.User | undefined>(undefined);
  useEffect(() => {
    fetch(`${url.api}/user`)
      .then((res) => res.json())
      .then((u) => setUser(u));
  }, []);

  return (
    <Box bgcolor="primary.main">
      <div>Homepage</div>
      <div>
        Welcome, <span>{user?.email ?? ""}</span>!
      </div>
      <Link href={`${url.server}/groups`}>
        <span style={{ color: "blue" }}>Groups</span>
      </Link>
      <br></br>
      <Link href={`${url.server}/friends`}>
        <span style={{ color: "blue" }}>Friends</span>
      </Link>
      <button onClick={()=>signOut()}>Sign Out</button>
    </Box>
  );
}
