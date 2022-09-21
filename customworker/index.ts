import { Prisma } from "@prisma/client";
import * as models from "../utils/models";
import * as parsing from "../utils/parsing";
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
    regexp: /api\/user\/friends\/(?<friendId>[\d]+)\/expense$/,
    handlerFunc: PUT_api_user_friends_friendId_expense,
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
      const regexpMatchGroups = routeHandler.regexp.exec(url)?.groups || {};

      const queryParams = routeHandler.expectingQueryParams
        ? parsing.getJsonFromUrl(url)
        : {};

      const mergedParams = {
        ...regexpMatchGroups,
        ...queryParams,
      };

      const body = routeHandler.expectingBody
        ? await event.request.clone().json() // clone is 1000% important!!!
        : undefined;
      routeHandler.handlerFunc(event.request, mergedParams, body);
      return;
    }
  }
}

function getUnusedIndex(arr: Array<{ id: number }>): number {
  let largestIndex = 0;
  for (const ele of arr) {
    if (ele.id > largestIndex) {
      largestIndex = ele.id;
    }
  }
  return largestIndex + 1;
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

  const newId = getUnusedIndex(groupSummaries);

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
    friendId ?? getUnusedIndex(friendSummaries.map((summary) => summary.user));
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

async function PUT_api_user_friends_friendId_expense(
  request: Request,
  params: { friendId: number },
  expenseAmount: number
) {
  const friendId = params.friendId;
  const key = "/api/user/friends/summary";
  const apiCache = await caches.open("apis");
}

// TODO: Notifications, can consider using workbox apis
