import Link from "next/link";
import { useEffect, useState } from "react";
import * as url from "../../utils/url";
import * as models from "../../utils/models";
export default function UserPage() {
  const [user, setUser] = useState<models.User | undefined>(undefined);
  useEffect(() => {
    fetch(`${url.api}/user`)
      .then((res) => res.json())
      .then((u) => setUser(u));
  }, []);

  return (
    <>
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
    </>
  );
}
