export const server = "http://localhost:3000";
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
