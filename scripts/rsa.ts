import * as crypto from "crypto";
import * as fs from "fs";

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

function generateAndStoreKeys() {
  const keyPair = crypto.generateKeyPairSync(RSA, options);
  const pubKeyBuf = keyPair.publicKey.export(pubKeyOptions);
  const priKeyBuf = keyPair.privateKey.export(priKeyOptions);
  if (!fs.existsSync("keys")) {
    fs.mkdirSync("keys");
  }
  fs.writeFileSync("keys/public.pem", pubKeyBuf, {
    flag: "w+",
  });
  fs.writeFileSync("keys/private.pem", priKeyBuf, {
    flag: "w+",
  });
}

generateAndStoreKeys();

export {};
