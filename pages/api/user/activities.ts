import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const payload = api.getTokenPayload(req, res);
      if (payload === null) {
        res.status(400).send("Invalid user");
        break;
      }
      const activities = await models.getActivities(payload.userId);
      res.status(200).json(activities);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
