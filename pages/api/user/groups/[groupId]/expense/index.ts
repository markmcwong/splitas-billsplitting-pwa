import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../../utils/models";
import * as api from "../../../../../../utils/api";
import { Prisma } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }
  const groupId = api.getGroupId(req);
  switch (req.method) {
    case "PUT": // TODO: Change to POST
      const input = JSON.parse(req.body) as Prisma.ExpenseCreateInput;
      const response = await models.createNewExpense(
        input,
        groupId,
        payload.userId
      );
      res.status(200).json(response);
      break;
    case "GET":
      // const splits = await models.getSplitsByGroup(groupId, payload.userId);
      res.status(200).json("not available");
      break;
    default:
      api.allowMethods(req, res, ["PUT", "GET"]);
  }
}
