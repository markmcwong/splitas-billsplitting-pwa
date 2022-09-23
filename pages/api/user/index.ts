import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }

  let userProfile: models.User;
  switch (req.method) {
    case "GET":
      userProfile = await models.getUserProfile(payload.userId);
      res.status(200).json(userProfile);
      break;
    case "PUT":
      const parsedProfile = JSON.parse(req.body) as models.User;
      if (payload.userId !== parsedProfile.id) {
        res.status(400).json("Unable to update profile of a different user");
        return;
      }
      userProfile = await models.updateUser(parsedProfile);
      res.status(200).json(userProfile);
      break;
    default:
      api.allowMethods(req, res, ["GET", "PUT"]);
  }
}
