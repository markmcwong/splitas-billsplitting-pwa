import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await api.getUserBySessionCookie(req, res);
  if (user === null) {
    res.status(400).json("User not found");
    return;
  }

  let userProfile;
  switch (req.method) {
    case "GET":
      userProfile = await models.getUserProfile(user.id);
      res.status(200).json(userProfile);
      break;
    case "PUT":
      userProfile = await models.updateUser(req.body as models.User);
      res.status(200).json(userProfile);
      break;
    default:
      api.allowMethods(req, res, ["GET", "PUT"]);
  }
}
