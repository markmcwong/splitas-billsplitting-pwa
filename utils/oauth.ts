import { BaseClient, Issuer } from "openid-client";
import * as url from "./urls";

const clientId = process.env["PAYMELAH_CLIENT_ID"];
if (clientId === undefined) {
  throw new Error("missing client id in environment");
}
const clientSecret = process.env["PAYMELAH_CLIENT_SECRET"];
if (clientSecret === undefined) {
  throw new Error("missing client secret in environment");
}

const googleIssuerPromise = Issuer.discover("https://accounts.google.com");
const clientPromise: Promise<BaseClient> = googleIssuerPromise.then(
  (issuer) => {
    return new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [url.oauthRedirect],
      response_types: ["code"],
    });
  }
);

export async function getAuthEndpointWithParams(state: string) {
  return (await clientPromise).authorizationUrl({
    scope: "openid profile email",
    state,
  });
}

export async function processRedirectFromAuthEndpoint(
  redirectUrlWithParams: string,
  state: string
) {
  const client = await clientPromise;
  const params = client.callbackParams(redirectUrlWithParams);
  const tokens = await client.callback(url.oauthRedirect, params, {
    response_type: "code",
    state,
  });
  return tokens;
}

export async function getUserEmail(accessToken: string) {
  const client = await clientPromise;
  const userInfo = await client.userinfo(accessToken);
  return userInfo.email;
}
