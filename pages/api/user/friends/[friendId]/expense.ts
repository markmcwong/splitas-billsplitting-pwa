import { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import * as models from "../../../../../utils/models";
import * as api from "../../../../../utils/api";
import * as webPushUtils from "../../../../../utils/web_push";
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
    case "PUT": // TODO Change to POST
      const parsedAmount = JSON.parse(req.body) as number;
      const response = await models.createFriendExpense(
        parsedAmount,
        payload.userId,
        friendId
      );
      const subscription = await models.getWebPushSubscriptionByUser(friendId);
      if (subscription !== null) {
        webPush.sendNotification(
          subscription,
          JSON.stringify(
            webPushUtils.generateNotificationFromUserCreateFriendExpense(
              payload.name,
              parsedAmount
            )
          )
        );
      }
      res.status(200).json(response);
      break;
    default:
      api.allowMethods(req, res, ["PUT"]);
  }
}
