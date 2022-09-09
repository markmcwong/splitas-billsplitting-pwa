import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../../../utils/models";
import * as reqHelpers from "../../../../../utils/req_helpers";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const groupId = reqHelpers.getGroupId(req);
  const group = await models.getGroupDetails(groupId);
  res.status(200).json(group);
}
