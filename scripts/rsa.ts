import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";

const RSA = "rsa";

// publicKeyEncoding: {
//   type: "spki",
//   format: "pem",
// },
// privateKeyEncoding: {
//   type: "pkcs8",
//   format: "pem",
//   cipher: "aes-256-cbc",

// },
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

const home = os.homedir();
export const keyDir = `${home}/webapp/keys`;
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
