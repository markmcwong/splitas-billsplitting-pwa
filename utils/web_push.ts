import webPush from "web-push";
const publicKey = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
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

export type PushNotificationContent = {
  title: string;
  message: string;
};

export function generateNotificationFromUserCreateGroupExpense(
  creatorName: string,
  groupName: string,
  splitAmount: number
): PushNotificationContent {
  return {
    title: `${creatorName} added expense in Group ${groupName}`,
    message: `You owe a split of ${splitAmount}`,
  };
}

export function generateNotificationFromUserCreateFriendExpense(
  creatorName: string,
  amount: number
): PushNotificationContent {
  return {
    title: `${creatorName} added expense`,
    message: `You owe ${amount}`,
  };
}
