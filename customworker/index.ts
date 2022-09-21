import { helloWorld } from "./helloworld";
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
    return;
  }

  rootHandler(event);
});

// POST / PUT requests handlers
// A basic router

interface CustomRouteHandler {
  regexp: RegExp;
  handlerFunc: Function;
}

const routeHandlers: Array<CustomRouteHandler> = [
  {
    regexp: /api\/user\/groups/,
    handlerFunc: api_users_groups,
  },
];

function rootHandler(event: FetchEvent) {
  const url = event.request.url;

  for (const routeHandler of routeHandlers) {
    if (routeHandler.regexp.test(url)) {
      event.respondWith(routeHandler.handlerFunc(event.request));
      return;
    }
  }
}

function api_users_groups(request: Request) {}

// TODO: Notifications, can consider using workbox apis
