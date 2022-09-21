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
    case "GET":
      const {
        friend: friendPromise,
        userExpenses: userExpensesPromise,
        friendExpenses: friendExpensesPromise,
        commonGroups: commonGroupsPromise,
      } = models.getFriendDetails(payload.userId, friendId);
      res.status(200).json({
        friend: await friendPromise,
        userExpenses: (await userExpensesPromise) || [],
        friendExpenses: (await friendExpensesPromise) || [],
        commonGroups: await commonGroupsPromise,
      });
      break;
    case "PUT":
      // TODO
      res.status(200).send("Not implemented yet");
      break;
    case "DELETE":
      await models.deleteFriend(payload.userId, friendId);
      res.status(200).send("Unfriended.");
    default:
      api.allowMethods(req, res, ["GET", "PUT", "DELETE"]);
  }
}