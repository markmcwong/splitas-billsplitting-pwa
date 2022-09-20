import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
import * as oauth from "../../../utils/oauth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }

  switch (req.method) {
    case "GET":
      const token = (await models.getTokenByUser(payload.userId))!;
      const contacts = await oauth.getAllContacts({
        access_token: token.accessToken,
        expiry_date: token.expiresAt,
        id_token: token.idToken,
        refresh_token: token.refreshToken,
        scope: token.scope ?? undefined,
      });
      res.status(200).json(contacts);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
