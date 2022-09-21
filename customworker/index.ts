import { Prisma } from "@prisma/client";
import * as models from "../utils/models";
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
  expectingBody: boolean;
}

const routeHandlers: Array<CustomRouteHandler> = [
  {
    regexp: /api\/user\/groups$/,
    handlerFunc: POST_api_user_groups,
    method: "POST",
    expectingBody: true,
  },
  {
    regexp: /api\/user\/friends$/,
    handlerFunc: POST_api_user_friends,
    method: "POST",
    expectingBody: true,
  },
];

async function rootHandler(event: FetchEvent) {
  const url = event.request.url;

  for (const routeHandler of routeHandlers) {
    if (routeHandler.method !== event.request.method) {
      continue;
    }

    const body = routeHandler.expectingBody
      ? await event.request.clone().json() // clone is 1000% important!!!
      : undefined;

    if (routeHandler.regexp.test(url)) {
      routeHandler.handlerFunc(event.request, body);
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
  groupCreateInput: Prisma.GroupCreateInput
) {
  switch (request.method) {
    case "POST":
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
      break;
    default:
      return;
  }
}

async function POST_api_user_friends(request: Request) {}

// TODO: Notifications, can consider using workbox apis
