import webPush from "web-push";
const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
const webPushEmail = process.env.WEB_PUSH_EMAIL;
if (
  publicKey === undefined ||
  privateKey === undefined ||
  webPushEmail === undefined
) {
  throw new Error("Vapid keys or email missing from environment");
}

webPush.setVapidDetails(`mailto:${webPushEmail}`, publicKey, privateKey);
