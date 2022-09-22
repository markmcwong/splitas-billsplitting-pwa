import jsonwebtoken from "jsonwebtoken";
import * as fs from "fs";
import * as rsa from "../scripts/rsa";
import * as models from "./models";

rsa.generateAndStoreKeys();
const publicKey = fs.readFileSync(rsa.publicKeyPath);
const privateKey = fs.readFileSync(rsa.privateKeyPath);

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
