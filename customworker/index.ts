import { Prisma } from "@prisma/client";
import * as models from "../utils/models";
import * as parsing from "../utils/parsing";
import { check_cookie_by_name } from "../utils/class_extension";
import type { GroupSummary } from "../pages/groups/index";
declare let self: ServiceWorkerGlobalScope;
self.addEventListener("message", (event) => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);
});

self.addEventListener("fetch", async function (event) {
  if (event.request.method === "GET") {
    return;
  }
  const url = event.request.url;
  console.log(url);
  if (navigator.onLine) {
    console.log("navigator online");
    return;
  }
  rootHandler(event);
  console.log("finish root handler");
});

// POST / PUT requests handlers
// A basic router

interface CustomRouteHandler {
  regexp: RegExp;
  handlerFunc: Function;
  method: "POST" | "PUT";
  expectingQueryParams: boolean;
  expectingBody: boolean;
}

const routeHandlers: Array<CustomRouteHandler> = [
  {
    regexp: /api\/user\/groups$/,
    handlerFunc: POST_api_user_groups,
    method: "POST",
    expectingQueryParams: false,
    expectingBody: true,
  },
  {
    regexp: /api\/user\/friends$/,
    handlerFunc: POST_api_user_friends,
    method: "POST",
    expectingQueryParams: true,
    expectingBody: false,
  },
  {
    regexp: /api\/user\/friends\/(?<friendId>[-\d]+)\/expense$/,
    handlerFunc: PUT_api_user_friends_friendId_expense,
    method: "PUT",
    expectingQueryParams: true,
    expectingBody: true,
  },
  {
    regexp: /api\/user\/groups\/(?<groupId>[-\d]+)\/expense$/,
    // TODO: Change to POST
    // TODO: Change to expenses
    handlerFunc: PUT_api_user_groups_groupId_expense,
    method: "PUT",
    expectingQueryParams: true,
    expectingBody: true,
  },
];

async function rootHandler(event: FetchEvent) {
  const url = event.request.url;

  for (const routeHandler of routeHandlers) {
    if (routeHandler.method !== event.request.method) {
      continue;
    }

    if (routeHandler.regexp.test(url)) {
      let mergedParams = {};
      if (routeHandler.expectingQueryParams) {
        const regexpMatchGroups = routeHandler.regexp.exec(url)?.groups || {};

        const queryParams = routeHandler.expectingQueryParams
          ? parsing.getJsonFromUrl(url)
          : {};

        mergedParams = {
          ...regexpMatchGroups,
          ...queryParams,
        };
      }

      const body = routeHandler.expectingBody
        ? await event.request.clone().json() // clone is 1000% important!!!
        : undefined;
      routeHandler.handlerFunc(event.request, mergedParams, body);
      return;
    }
  }
}

function getUnusedOfflineId(arr: Array<{ id: number }>): number {
  let smallestIndex = 0;
  for (const ele of arr) {
    if (ele.id < smallestIndex) {
      smallestIndex = ele.id;
    }
  }
  return smallestIndex - 1;
}

async function POST_api_user_groups(
  request: Request,
  _: unknown,
  groupCreateInput: Prisma.GroupCreateInput
) {
  console.log(groupCreateInput);
  const key = "/api/user/groups/summary";
  const apiCache = await caches.open("apis");
  const groupSummaryResponse = await apiCache.match(key);
  const groupSummaries: Array<GroupSummary> =
    (await groupSummaryResponse?.json()) || [];

  const newId = getUnusedOfflineId(groupSummaries);

  const newGroupSummary: GroupSummary = {
    id: newId,
    name: groupCreateInput.name,
    payment: 0,
    split: 0,
  };
  groupSummaries.push(newGroupSummary);
  await apiCache.put(key, new Response(JSON.stringify(groupSummaries)));
}

async function POST_api_user_friends(
  request: Request,
  queryParams: { friendId?: number; friendEmail?: string },
  _: unknown
) {
  const friendId = queryParams.friendId;
  const friendEmail = queryParams.friendEmail;
  if (friendId === undefined && friendEmail === undefined) {
    return;
  }

  const key = "/api/user/friends/summary";
  const apiCache = await caches.open("apis");
  const friendSummaryResponse = await apiCache.match(key);
  const friendSummaries: Awaited<
    ReturnType<typeof models.getAllFriendWithExpensesDetails>
  > = (await friendSummaryResponse?.json()) || [];
  let friend: models.User | undefined = undefined;
  if (friendId !== undefined) {
    friend = friendSummaries.find(
      (summary) => summary.user.id === friendId
    ).user;
  } else if (queryParams.friendEmail !== undefined) {
    friend = friendSummaries.find(
      (summary) => summary.user.email === friendEmail
    ).user;
  }

  if (friend !== undefined) {
    console.log("friend exists");
    return;
  }

  const newId =
    friendId ??
    getUnusedOfflineId(friendSummaries.map((summary) => summary.user));
  const newName = "unknown";
  const newEmail = friendEmail ?? "unknown";
  const user: models.User = {
    id: newId,
    name: newName,
    email: newEmail,
    hasAccount: false,
    tokenId: null,
  };

  const newFriendSummary: typeof friendSummaries[number] = {
    amount: 0,
    user,
  };

  friendSummaries.push(newFriendSummary);
  await apiCache.put(key, new Response(JSON.stringify(friendSummaries)));
}

function getCurrentUserId() {
  const userIdStr = check_cookie_by_name("userId");
  if (userIdStr === undefined) {
    return;
  }
  return Number.parseInt(userIdStr);
}

async function PUT_api_user_friends_friendId_expense(
  request: Request,
  params: { friendId: number },
  expenseAmount: number
) {
  const friendId = params.friendId;
  const friendsSummaryKey = "/api/user/friends/summary";
  const friendDetailsKey = `/api/user/friends/${friendId}`;
  const apiCache = await caches.open("apis");
  const userId = getCurrentUserId();
  if (userId === undefined) {
    return;
  }
  const newId = 1;
  const friendsSummaryResponse = await apiCache.match(friendsSummaryKey);
  const friendsSummary: Awaited<
    ReturnType<typeof models.getAllFriendWithExpensesDetails>
  > = (await friendsSummaryResponse?.json()) || [];
  const friendSummaryIndex = friendsSummary.findIndex(
    (summary) => summary.user.id === friendId
  );
  if (friendSummaryIndex !== -1) {
    friendsSummary[friendSummaryIndex].amount += expenseAmount;
    await apiCache.put(
      friendsSummaryKey,
      new Response(JSON.stringify(friendsSummary))
    );
  }

  const friendDetailsResponse = await apiCache.match(friendDetailsKey);
  if (friendDetailsResponse === undefined) {
    return;
  }
  const friendDetails: Awaited<ReturnType<typeof models.getFriendDetails>> =
    await friendDetailsResponse.json();
  const friendExpense: models.FriendExpense = {
    id: newId,
    amount: expenseAmount,
    payerId: userId,
    userOwingMoneyId: friendId,
    timestamp: new Date(),
  };
  friendDetails.userExpenses.push(friendExpense);
  await apiCache.put(
    friendDetailsKey,
    new Response(JSON.stringify(friendDetails))
  );
}

async function PUT_api_user_groups_groupId_expense(
  request: Request,
  params: { groupId: number },
  body: { amount: number; description: string }
) {
  const groupId = params.groupId;
  const groupDetailsKey = `/api/user/groups/${groupId}`;

  const apiCache = await caches.open("apis");
  const groupDetailsResponse = await apiCache.match(groupDetailsKey);
  const groupDetails: Awaited<ReturnType<typeof models.getGroupDetails>> =
    await groupDetailsResponse?.json();
  if (!groupDetails) {
    return;
  }
  const userId = getCurrentUserId();
  if (userId === undefined) {
    return;
  }
  const newId = getUnusedOfflineId(groupDetails.Expenses);
  const expenseKey = `${groupDetailsKey}/expense/${newId}`; // TODO: Need to merge create expense and create split
  const newExpense: models.Expense = {
    id: newId,
    amount: body.amount,
    description: body.description,
    groupId,
    payerId: userId,
    timestamp: new Date(),
  };

  groupDetails.Expenses.push(newExpense);
  await apiCache.put(
    groupDetailsKey,
    new Response(JSON.stringify(groupDetails))
  );
}

// TODO: Notifications, can consider using workbox apis
