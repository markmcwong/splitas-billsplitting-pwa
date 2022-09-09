import { NextApiRequest } from "next";

export function getUserId(req: NextApiRequest): number {
  return Number.parseInt(req.query["userId"] as string);
}

export function getGroupId(req: NextApiRequest): number {
  return Number.parseInt(req.query["groupId"] as string);
}

export function getFriendId(req: NextApiRequest): number {
  return Number.parseInt(req.query["friendId"] as string);
}
