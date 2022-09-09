import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const groupId = api.getGroupId(req);
  let group;
  switch (req.method) {
    case "GET":
      group = await models.getGroupDetails(groupId);
      res.status(200).json(group);
      break;
    case "PUT":
      group = await models.updateGroup(req.body as models.Group);
      res.status(200).json(group);
    default:
      api.allowMethods(req, res, ["GET", "PUT"]);
  }
}
