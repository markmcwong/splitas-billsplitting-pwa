import jsonwebtoken from "jsonwebtoken";
import * as fs from "fs";
import * as models from "./models";
const publicKey = fs.readFileSync("keys/public.pem");
const privateKey = fs.readFileSync("keys/private.pem");

export type TokenPayload = {
  userId: number;
  name: string;
  email: string;
};

export function getToken(user: models.User) {
  return jsonwebtoken.sign(
    { userId: user.id, name: user.name, email: user.email },
    privateKey,
    {
      algorithm: "RS256",
    }
  );
}

export function verifyToken(token: string): TokenPayload {
  return jsonwebtoken.verify(token, publicKey) as TokenPayload;
}
