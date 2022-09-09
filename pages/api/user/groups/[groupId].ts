import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
import * as authorizeActions from "../../../../utils/authorize_actions";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await api.getUserBySessionCookie(req, res);
  if (user === null) {
    res.status(400).json("User not found");
    return;
  }
  const groupId = api.getGroupId(req);
  const group = await authorizeActions.authorizeGroup(user.id, groupId);
  if (!group) {
    res.status(400).send("Group not found");
    return;
  }
  switch (req.method) {
    case "GET":
      res.status(200).json(group);
      break;
    case "PUT":
      const parsedGroup = JSON.parse(req.body) as models.Group;
      const updatedGroup = await models.updateGroup(parsedGroup);
      res.status(200).json(updatedGroup);
      break;
    default:
      api.allowMethods(req, res, ["GET", "PUT"]);
  }
}
