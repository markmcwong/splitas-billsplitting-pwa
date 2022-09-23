import { NextApiRequest, NextApiResponse } from "next";
import { TokenSet } from "openid-client";
import * as models from "../../utils/models";
import * as api from "../../utils/api";
import * as oauth from "../../utils/oauth";
import * as jwt from "../../utils/jwt";
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
  console.log(redirectUrl);
  if (redirectUrl === undefined) {
    // TODO
    res.status(400).send("TODO: Implement error flow");
    return;
  }

  const tokenSet = await oauth.processRedirectFromAuthEndpoint(
    redirectUrl,
    state
  );

  const {
    access_token: accessToken,
    id_token: idToken,
    refresh_token: refreshToken,
  } = tokenSet;
  console.log(tokenSet);
  if (!accessToken || !idToken || !refreshToken) {
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

  let user = await models.getUserByEmail(email);

  const tokenSharedFields = {
    accessToken,
    idToken,
    refreshToken,
    expiresAt: tokenSet.expires_at ?? null,
    expiresIn: tokenSet.expires_in ?? null,
    scope: tokenSet.scope ?? null,
    sessionState: tokenSet.session_state ?? null,
  };
  if (user === null || !user.hasAccount) {
    const oauthTokenInput: Prisma.OauthTokenCreateInput = {
      ...tokenSharedFields,
    };

    const oauthToken = await models.createToken(oauthTokenInput);
    const userInput: Prisma.UserCreateInput = {
      email,
      hasAccount: true,
      name: email,
      OauthToken: {
        connect: {
          id: oauthToken.id,
        },
      },
    };
    user = await models.createUser(userInput);
  } else {
    const oauthToken: models.OauthToken = {
      id: user.tokenId!,
      ...tokenSharedFields,
    };
    await models.updateToken(oauthToken);
  }

  const session = jwt.getToken(user);
  api.setSessionCookie(req, res, session);
  api.setUserIdCookie(req, res, user.id);

  res.status(200).json("success, your email is " + email);
}
