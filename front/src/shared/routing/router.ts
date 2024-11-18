import { createHistoryRouter, createRoute } from "atomic-router";

export const routes = {
  profile: createRoute(),

  signIn: createRoute(),
  signUp: createRoute(),

  home: createRoute(),
};

export const router = createHistoryRouter({
  routes: [
    { route: routes.profile, path: "/profile" },
    { route: routes.signIn, path: "/sign-in" },
    { route: routes.signUp, path: "/sign-up" },
    { route: routes.home, path: "/" },
  ],
});
