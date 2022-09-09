import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as reqHelpers from "../../../../../utils/req_helpers";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = reqHelpers.getUserId(req);
  const friendId = reqHelpers.getFriendId(req);
  const { friend: friendPromise, commonGroups: commonGroupsPromise } =
    models.getFriendDetails(userId, friendId);
  res.status(200).json({
    friend: await friendPromise,
    commonGroups: await commonGroupsPromise,
  });
}
