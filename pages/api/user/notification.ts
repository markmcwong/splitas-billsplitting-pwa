import { NextApiRequest, NextApiResponse } from "next";
import webPush, { PushSubscription } from "web-push";
import * as api from "../../../utils/api";
import * as models from "../../../utils/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = api.getTokenPayload(req, res);
  if (payload === null) {
    res.status(400).json("Invalid token");
    return;
  }
  if (req.method == "PUT") {
    const subscription = JSON.parse(req.body) as PushSubscription;
    console.log(subscription);

    await models.createOrUpdateWebPushSubscription(
      subscription,
      payload.userId
    );
    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: "Hello Web Push",
          message: "Your web push notification is here!",
        })
      )
      .then((response) => {
        res.writeHead(response.statusCode, response.headers).end(response.body);
      })
      .catch((err) => {
        if ("statusCode" in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body);
        } else {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      });
  } else {
    res.statusCode = 405;
    res.end();
  }
}
