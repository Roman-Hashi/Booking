import { authGuard, chain, routes, unauthorizedGuard } from "@shared/routing";
import { createRoutesView } from "atomic-router-react";
import { HomeScreen } from "./user/home";
import { SignInScreen } from "./auth/sign-in";
import { SignUpScreen } from "./auth/sign-up";
import { MainLayout } from "@layouts/main-layout";

export const RoutesView = createRoutesView({
  routes: [
    {
      route: chain(authGuard())(routes.home),
      view: HomeScreen,
      layout: MainLayout,
    },

    { route: chain(unauthorizedGuard())(routes.signIn), view: SignInScreen },
    { route: chain(unauthorizedGuard())(routes.signUp), view: SignUpScreen },
  ],
});
