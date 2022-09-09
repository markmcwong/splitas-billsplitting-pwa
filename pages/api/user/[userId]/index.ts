import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../utils/models";
import * as reqHelpers from "../../../../utils/req_helpers";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = reqHelpers.getUserId(req);
  const userProfile = await models.getUserProfile(userId);
  res.status(200).json(userProfile);
}
