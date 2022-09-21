import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }
  const friendId = api.getFriendId(req);
  switch (req.method) {
    case "PUT":
      const parsedAmount = JSON.parse(req.body) as number;
      const response = await models.createFriendExpense(
        parsedAmount,
        payload.userId,
        friendId
      );
      res.status(200).json(response);
      break;
    default:
      api.allowMethods(req, res, ["PUT"]);
  }
}
