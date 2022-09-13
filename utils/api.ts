import { NextApiRequest, NextApiResponse } from "next";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import { randomBytes, randomInt, randomUUID } from "crypto";
import * as models from "./models";

export function getGroupId(req: NextApiRequest): number {
  return Number.parseInt(req.query["groupId"] as string);
}

export function getFriendId(req: NextApiRequest): number {
  return Number.parseInt(req.query["friendId"] as string);
}

export function allowMethods(
  req: NextApiRequest,
  res: NextApiResponse,
  methods: Array<string>
) {
  res.setHeader("Allow", methods);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

const cookieNames = {
  oauthState: "oauth_state",
  session: "session",
};

export function getSessionCookie(req: NextApiRequest, res: NextApiResponse) {
  return getCookie(cookieNames.session, { req, res })?.toString();
}

export function getUserBySessionCookie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSessionCookie(req, res)?.toString();
  if (session === undefined) {
    return null;
  }
  return models.getUserBySession(session);
}

export function setSessionCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  value: string
) {
  setCookie(cookieNames.session, value, { req, res });
}

export function generateStateAndSetCookie(
  req: NextApiRequest,
  res: NextApiResponse
): string {
  const state = randomUUID();
  setCookie(cookieNames.oauthState, state, {
    req,
    res,
    maxAge: 60 * 60 * 24,
  });
  return state;
}

export function getStateFromCookie(
  req: NextApiRequest,
  res: NextApiResponse
): string | undefined {
  return getCookie(cookieNames.oauthState, { req, res })?.toString();
}
