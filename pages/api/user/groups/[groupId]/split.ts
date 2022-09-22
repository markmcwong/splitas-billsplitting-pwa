import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
import { Prisma, Split } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  type bodyType = {
    expenseId?: number;
  };

  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }
  const groupId = api.getGroupId(req);
  switch (req.method) {
    case "PUT": // TODO: Change to POST
      const input = JSON.parse(req.body) as Split[];
      console.log(input);
      models.createSplits(input, payload.userId);
      res.status(200).json("success");
      break;
    case "POST": // TODO: Change to PUT
      const parsedAmount = JSON.parse(req.body) as Split[];
      models.updateSplit(parsedAmount);
      res.status(200).json("success");
      break;
    case "GET":
      const splits = await models.getSplitsByGroup(groupId, payload.userId);
      res.status(200).json(splits);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST", "PUT"]);
  }
}
