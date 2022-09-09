import * as url from "../../utils/url";
export default function index() {
  fetch(`${url.server}/api/user`);
  return <div>Homepage</div>;
}
