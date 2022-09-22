export const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://2022-a3-2022-a3-group-10.vercel.app";

export const api = `${server}/api`;
export const oauthRedirect = `${server}/auth`;
export const homepage = `${server}/user`;

export const APP = "";

export const GROUPS = "/groups";
export const FRIENDS = "/friends";
export const ACTIVITIES = "/activities";
export const PROFILE = "/user";

export enum AppRoutesValues {
  Groups = 0,
  Friends,
  Activity,
  Profile,
}

export const AppRoutes = [
  APP + GROUPS,
  APP + FRIENDS,
  APP + ACTIVITIES,
  APP + PROFILE,
];
