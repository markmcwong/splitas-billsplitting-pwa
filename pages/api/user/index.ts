import { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../../utils/models";
import * as api from "../../../utils/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const user = models.createUser(req.body as models.User);
      res.status(200).json(user);
      break;
    default:
      api.allowMethods(req, res, ["POST"]);
  }
}
