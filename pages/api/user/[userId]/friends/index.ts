import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = api.getUserId(req);
  switch (req.method) {
    case "GET":
      const friends = models.getFriendsList(userId);
      res.status(200).json(friends);
      break;
    case "POST":
      const friendId = api.getFriendId(req);
      const friend = models.createFriend(userId, friendId);
      res.status(200).json(friend);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
