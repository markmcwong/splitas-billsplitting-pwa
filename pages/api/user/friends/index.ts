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
      let friendId: number;
      if (api.hasFriendId(req)) {
        friendId = api.getFriendId(req);
      } else if (api.hasFriendEmail(req)) {
        const email = api.getFriendEmail(req);
        let user = await models.getUserByEmail(email);
        if (user === null) {
          user = await models.createUser({
            name: email,
            email,
            hasAccount: false,
          });
        }
        friendId = user.id;
      } else {
        res.status(400);
        return;
      }
      const friend = await models.createFriend(payload.userId, friendId);
      res.status(200).json({ userId: friendId });
      break;
    default:
      api.allowMethods(req, res, ["GET", "POST"]);
  }
}
