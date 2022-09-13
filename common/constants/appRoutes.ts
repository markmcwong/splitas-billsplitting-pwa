export const APP = "/app";

export const GROUPS = "/groups";
export const FRIENDS = "/friends";
export const ACTIVITY = "/activity";
export const PROFILE = "/profile";

export enum AppRoutesValues {
  Groups = 0,
  Friends,
  Activity,
  Profile,
}

export const AppRoutes = [
  APP + GROUPS,
  APP + FRIENDS,
  APP + ACTIVITY,
  APP + PROFILE,
];
