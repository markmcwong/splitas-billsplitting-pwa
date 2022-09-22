import * as crypto from "crypto";
import * as fs from "fs";

const RSA = "rsa";

const options: crypto.RSAKeyPairKeyObjectOptions = {
  modulusLength: 1024 * 2,
};

const pubKeyOptions: crypto.KeyExportOptions<"pem"> = {
  type: "spki",
  format: "pem",
};

const priKeyOptions: crypto.KeyExportOptions<"pem"> = {
  type: "pkcs8",
  format: "pem",
};

export const keyDir = `./keys`;
export const publicKeyPath = `${keyDir}/public.pem`;
export const privateKeyPath = `${keyDir}/private.pem`;
export function generateAndStoreKeys() {
  const keyPair = crypto.generateKeyPairSync(RSA, options);
  const pubKeyBuf = keyPair.publicKey.export(pubKeyOptions);
  const priKeyBuf = keyPair.privateKey.export(priKeyOptions);

  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir, { recursive: true });
  }
  fs.writeFileSync(publicKeyPath, pubKeyBuf, {
    flag: "w+",
  });
  fs.writeFileSync(privateKeyPath, priKeyBuf, {
    flag: "w+",
  });
}
