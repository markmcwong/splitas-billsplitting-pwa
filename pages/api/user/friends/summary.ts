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
      const friendsWithExpenses = await models.getAllFriendWithExpensesDetails(
        payload.userId
      );
      res.status(200).json(friendsWithExpenses);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
