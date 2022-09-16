import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
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
      const friends = await models.getFriendsList(payload.userId);
      res.status(200).json(friends);
      break;
    case "POST":
      const friendId = api.getFriendId(req);
      const friend = await models.createFriend(payload.userId, friendId);
      res.status(200).json(friend);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
