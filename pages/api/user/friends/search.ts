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
      const email = api.getFriendEmail(req);
      let ans;
      console.log(req.query["isForGroup"]);
      if (req.query["isForGroup"] === "true") {
        ans = await models.findUsersAddForGroup(
          email,
          payload.userId,
          parseInt(req.query["groupId"] as string)
        );
      } else {
        ans = await models.getUserByEmailFuzzySearch(email, payload.userId);
      }
      res.status(200).json(ans);
      break;
    default:
      api.allowMethods(req, res, ["GET"]);
  }
}
