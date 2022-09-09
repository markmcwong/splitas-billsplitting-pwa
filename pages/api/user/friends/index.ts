import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as api from "../../../../utils/api";
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
      const friends = models.getFriendsList(user.id);
      res.status(200).json(friends);
      break;
    case "POST":
      const friendId = api.getFriendId(req);
      const friend = models.createFriend(user.id, friendId);
      res.status(200).json(friend);
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
