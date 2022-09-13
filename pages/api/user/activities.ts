import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const user = await api.getUserBySessionCookie(req, res);
      if (user === null) {
        res.status(400).send("User not found");
        break;
      }
      const activities = await models.getActivities(user.id);
      res.status(200).json(activities);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
