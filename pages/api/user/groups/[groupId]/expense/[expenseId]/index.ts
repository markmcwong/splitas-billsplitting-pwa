import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../../../utils/models";
import * as api from "../../../../../../../utils/api";
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
  const expenseId = api.getExpenseId(req);

  switch (req.method) {
    case "GET":
      const splits = await models.getSplitsByExpense(expenseId, groupId);
      res.status(200).json(splits);
      break;
    case "POST":
      const input = JSON.parse(req.body);
      const ans = await models.createPayments(
        input.amount,
        payload.userId,
        input.paidToId,
        groupId
      );
      res.status(200).json(ans);
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
