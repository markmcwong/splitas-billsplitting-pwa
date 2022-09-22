import jsonwebtoken from "jsonwebtoken";
import * as fs from "fs";
import * as models from "./models";
// const publicKey = fs.readFileSync("keys/public.pem");
// const privateKey = fs.readFileSync("keys/private.pem");
const publicKey = process.env.JWT_PUBLIC_KEY ?? "";
const privateKey = process.env.JWT_PRIVATE_KEY ?? "";
if (publicKey === "" || privateKey === "") {
  throw new Error("JWT key pair missing");
}

export type TokenPayload = {
  userId: number;
  name: string;
  email: string;
};

export function getToken(user: models.User) {
  return jsonwebtoken.sign(
    { userId: user.id, name: user.name, email: user.email },
    Buffer.from(privateKey, "utf-8"),
    {
      algorithm: "RS256",
    }
  );
}

export function verifyToken(token: string): TokenPayload {
  return jsonwebtoken.verify(token, publicKey) as TokenPayload;
}
