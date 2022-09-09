import { NextApiRequest, NextApiResponse } from "next";
import { TokenSet } from "openid-client";
import * as models from "../../utils/models";
import * as api from "../../utils/api";
import * as oauth from "../../utils/oauth";
import { Prisma } from "@prisma/client";

export type RequestBody = {
  redirectUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const state = api.getStateFromCookie(req, res);
  if (state === undefined) {
    // TODO
    res.status(400).send("TODO: Implement error flow");
    return;
  }

  const { redirectUrl } = JSON.parse(req.body) as RequestBody;

  if (redirectUrl === undefined) {
    // TODO
    res.status(400).send("TODO: Implement error flow");
    return;
  }

  const tokenSet: TokenSet = await oauth.processRedirectFromAuthEndpoint(
    redirectUrl,
    state
  );

  const { access_token: accessToken, id_token: idToken } = tokenSet;

  if (accessToken === undefined || idToken === undefined) {
    res.status(400).send("Unable to continue with authentication.");
    return;
  }

  const email = await oauth.getUserEmail(accessToken);
  if (email === undefined) {
    res
      .status(400)
      .send("Unable to continue with authentication as no email is provided.");
    return;
  }

  const user = await models.getUserByEmail(email);

  const tokenSharedFields = {
    accessToken,
    idToken,
    refreshToken: tokenSet.refresh_token ?? null,
    expiresAt: tokenSet.expires_at ?? null,
    expiresIn: tokenSet.expires_in ?? null,
    scope: tokenSet.scope ?? null,
    sessionState: tokenSet.session_state ?? null,
  };
  if (user === null) {
    const oauthToken: Prisma.OauthTokenCreateInput = {
      ...tokenSharedFields,
    };
    models.createToken(oauthToken);
  } else {
    const oauthToken: models.OauthToken = {
      id: user.tokenId,
      ...tokenSharedFields,
    };
    models.updateToken(oauthToken);
  }

  // TODO: This is terrible, but I'm a bit lazy right now.
  api.setSessionCookie(req, res, email);

  res.status(200).json("success");
}
