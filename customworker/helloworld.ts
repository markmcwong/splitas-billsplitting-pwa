export function helloWorld(event: FetchEvent) {
  console.log("Hello world! We are offline!");
  console.log(event.request);
}
