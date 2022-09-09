import { NextApiRequest, NextApiResponse } from "next";

export function getUserId(req: NextApiRequest): number {
  return Number.parseInt(req.query["userId"] as string);
}

export function getGroupId(req: NextApiRequest): number {
  return Number.parseInt(req.query["groupId"] as string);
}

export function getFriendId(req: NextApiRequest): number {
  return Number.parseInt(req.query["friendId"] as string);
}

export function allowMethods(
  req: NextApiRequest,
  res: NextApiResponse,
  methods: Array<string>
) {
  res.setHeader("Allow", methods);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
