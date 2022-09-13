import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
import { Prisma } from "@prisma/client";
export type PostBody = Prisma.GroupCreateInput;
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
      const userWithGroups = await models.getGroupsList(payload.userId);
      res.status(200).json(userWithGroups);
      break;
    case "POST":
      const parsedGroup = JSON.parse(req.body) as Prisma.GroupCreateInput;
      const group = await models.createGroup(parsedGroup, payload.userId);
      res.status(200).json(group);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
