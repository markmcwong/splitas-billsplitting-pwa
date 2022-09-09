import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
import { Prisma } from "@prisma/client";
export type PostBody = Prisma.GroupCreateInput;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await api.getUserBySessionCookie(req, res);
  if (user === null) {
    res.status(400).json("User not found");
    return;
  }
  switch (req.method) {
    case "GET":
      const userWithGroups = await models.getGroupsList(user.id);
      res.status(200).json(userWithGroups);
      break;
    case "POST":
      const parsedGroup = JSON.parse(req.body) as Prisma.GroupCreateInput;
      const group = await models.createGroup(parsedGroup, user.id);
      res.status(200).json(group);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
