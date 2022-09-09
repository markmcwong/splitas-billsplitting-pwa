import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = api.getUserId(req);
  switch (req.method) {
    case "GET":
      const groups = await models.getGroupsList(userId);
      res.status(200).json(groups);
      break;
    case "POST":
      const group = await models.createGroup(req.body as models.Group, userId);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
