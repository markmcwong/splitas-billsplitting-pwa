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
      const friendId = api.getFriendId(req);
      const { friend: friendPromise, commonGroups: commonGroupsPromise } =
        models.getFriendDetails(user.id, friendId);
      res.status(200).json({
        friend: await friendPromise,
        commonGroups: await commonGroupsPromise,
      });
      break;
    case "PUT":
      // TODO
      res.status(200).send("Not implemented yet");
      break;
    default:
      api.allowMethods(req, res, ["GET", "PUT"]);
  }
}
