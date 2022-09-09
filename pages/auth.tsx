import * as url from "../utils/url";
import { RequestBody } from "./api/auth";
export default function AuthRedirect() {
  if (typeof window !== "undefined") {
    const currentUrl = window.location.href;
    const requestBody: RequestBody = {
      redirectUrl: currentUrl,
    };

    fetch(`${url.api}/auth`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  return <div>You have been redirected! Yay!</div>;
}
