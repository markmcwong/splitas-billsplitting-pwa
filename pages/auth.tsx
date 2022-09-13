import { useRouter } from "next/router";
import { useEffect } from "react";
import * as url from "../utils/urls";
import { RequestBody } from "./api/auth";
export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      const requestBody: RequestBody = {
        redirectUrl: currentUrl,
      };
      console.log("POSTing to auth");
      fetch(`${url.api}/auth`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      }).then(() => router.push(`${url.server}/user`));
    }
  }, [router]);

  return <div>Hang on, logging you in...</div>;
}
