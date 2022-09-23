import { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import { Prisma } from "@prisma/client";
import * as models from "../../../../../../utils/models";
import * as api from "../../../../../../utils/api";
import * as webPushUtils from "../../../../../../utils/web_push";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }
  const groupId = api.getGroupId(req);
  switch (req.method) {
    case "POST":
      const input = JSON.parse(req.body) as Prisma.ExpenseCreateInput;

      const response = await models.createNewExpense(
        input,
        groupId,
        payload.userId
      );
      const group = await models.getGroupById(groupId);
      const splitInput = input.Splits?.createMany?.data as Array<models.Split>;
      console.log(splitInput);
      for (const split of splitInput) {
        const subscription = await models.getWebPushSubscriptionByUser(
          split.userId
        );
        if (subscription === null) {
          continue;
        }

        webPush.sendNotification(
          subscription,
          JSON.stringify(
            webPushUtils.generateNotificationFromUserCreateGroupExpense(
              payload.name,
              group.name,
              split.amount
            )
          )
        );
      }
      res.status(200).json(response);
      break;
    case "GET":
      // const splits = await models.getSplitsByGroup(groupId, payload.userId);
      res.status(200).json("not available");
      break;
    default:
      api.allowMethods(req, res, ["POST", "GET"]);
  }
}
