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
      const friendId = api.getFriendId(req);
      const { friend: friendPromise, commonGroups: commonGroupsPromise } =
        models.getFriendDetails(userId, friendId);
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
