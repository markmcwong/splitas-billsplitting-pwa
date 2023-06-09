import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as url from "../utils/urls";
import { RequestBody } from "./api/auth";
export default function AuthPage() {
  const router = useRouter();
  const [doneSend, setDoneSend] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (doneSend) {
        return;
      }
      const currentUrl = window.location.href;
      const requestBody: RequestBody = {
        redirectUrl: currentUrl,
      };
      setDoneSend(true);
      fetch(`${url.api}/auth`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      }).then(() => router.push(`${url.server}/user`));
    }
  }, [router, doneSend]);

  return <div>Hang on, logging you in...</div>;
}
