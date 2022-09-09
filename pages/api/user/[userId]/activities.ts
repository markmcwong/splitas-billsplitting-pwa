import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const userId = api.getUserId(req);
      const activities = await models.getActivities(userId);
      res.status(200).json(activities);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
