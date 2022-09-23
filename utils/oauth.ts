import { BaseClient, Issuer, custom } from "openid-client";
import { google, people_v1 } from "googleapis";
import { Credentials } from "google-auth-library";
import * as url from "./urls";
import { GaxiosResponse } from "googleapis-common";
import * as parsing from "./parsing";
import * as fs from "fs";
import fetch from "node-fetch";

const getJsonFromUrl = parsing.getJsonFromUrl;

const clientId = process.env["PAYMELAH_CLIENT_ID"];
if (clientId === undefined) {
  throw new Error("missing client id in environment");
}
const clientSecret = process.env["PAYMELAH_CLIENT_SECRET"];
if (clientSecret === undefined) {
  throw new Error("missing client secret in environment");
}

const googleOAuthClient = new google.auth.OAuth2(
  clientId,
  clientSecret,
  url.oauthRedirect
);

const scopes = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/contacts.readonly",
  "https://www.googleapis.com/auth/contacts.other.readonly",
];

google.options({ auth: googleOAuthClient });
const people = google.people("v1");

const googleIssuerPromise = Issuer.discover("https://accounts.google.com");
const clientPromise: Promise<BaseClient> = googleIssuerPromise.then(
  (issuer) => {
    const client = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [url.oauthRedirect],
      response_types: ["code"],
    });
    return client;
  }
);

export async function getAuthEndpointWithParams(state: string) {
  const client = await clientPromise;
  return client.authorizationUrl({
    scope:
      "openid profile email https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly",
    state,
    access_type: "offline", // google specific
    prompt: "consent",
  });
  // This works too
  return googleOAuthClient.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes,
    prompt: "consent",
    state: state,
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
  // This works too
  // const code = getJsonFromUrl(redirectUrlWithParams)["code"] as string;
  // const tokens = (await googleOAuthClient.getToken(code)).tokens;
  return tokens;
}

export async function refreshTokens(refreshToken: string) {
  const client = await clientPromise;
  return client.refresh(refreshToken);
}

export async function getUserEmail(accessToken: string) {
  const client = await clientPromise;
  const userInfo = await client.userinfo(accessToken);
  return userInfo.email;
}

const imageUrlToBase64 = async (url: string) => {
  const response = await fetch(url);
  let contentType = response.headers.get("Content-Type");
  let buffer = await response.buffer();
  return "data:" + contentType + ";base64," + buffer.toString("base64");
};

export async function getUserProfileImage(
  userEmail: string,
  credentials: Credentials
) {
  googleOAuthClient.setCredentials(credentials);
  console.log(userEmail);

  const response = await people.people.get({
    resourceName: "people/me",
    personFields: "photos",
  });

  const photos = response.data.photos;
  if (photos === undefined) {
    return undefined;
  }
  const url = photos[0].url;
  if (!url) {
    return undefined;
  }
  return imageUrlToBase64(url);
}

async function getContacts(pageToken?: string) {
  return people.otherContacts.list({
    pageSize: 100,
    pageToken,
    readMask: "emailAddresses,names",
  });
  // Alternative
  // return people.people.connections.list({
  //   pageSize: 100,
  //   pageToken,
  //   personFields: "emailAddresses,names",
  //   resourceName: "people/me",
  //   sortOrder: "LAST_NAME_ASCENDING",
  // });
}

export type ContactInfo = {
  name: string;
  emailAddress: string;
};

export async function getAllContacts(
  credentials: Credentials
): Promise<ContactInfo> {
  googleOAuthClient.setCredentials(credentials);
  let pageToken: string | undefined = undefined;
  const allContacts = [];
  while (true) {
    const response: GaxiosResponse<people_v1.Schema$ListOtherContactsResponse> =
      await getContacts(pageToken);
    console.log(response);
    pageToken = response.data.nextPageToken ?? undefined;
    const contactInfos = (response.data.otherContacts ?? [])
      .filter(
        (info) =>
          info.names !== undefined &&
          info.names.length > 0 &&
          info.emailAddresses != undefined &&
          info.emailAddresses.length > 0
      )
      .map((info) => ({
        // TODO: As there is no guaranteed return order, this can fail. Even if we sort, the user may just create a new email address.
        name: info.names![0].displayName as string,
        emailAddress: info.emailAddresses![0].value as string,
      }));
    allContacts.push(...contactInfos);
    if (pageToken === undefined) {
      return allContacts;
    }
  }
}
