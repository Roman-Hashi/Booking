import { $user } from "@shared/user";
import {
  chainRoute,
  RouteInstance,
  RouteParams,
  RouteParamsAndQuery,
} from "atomic-router";
import { createEvent, sample } from "effector";
import { routes } from "./router";

export function authGuard<Params extends RouteParams>() {
  return (route: RouteInstance<Params>) => {
    const checkStarted = createEvent<RouteParamsAndQuery<Params>>();

    const isAuthenticated = sample({
      clock: checkStarted,
      source: $user,
      filter: Boolean,
    });

    sample({
      clock: checkStarted,
      source: $user,
      filter: (user) => !user,
      target: routes.signIn.open,
    });

    return chainRoute({
      route,
      beforeOpen: checkStarted,
      openOn: isAuthenticated,
    });
  };
}

export function unauthorizedGuard<Params extends RouteParams>() {
  return (route: RouteInstance<Params>) => {
    const checkStarted = createEvent<RouteParamsAndQuery<Params>>();

    const isAuthenticated = sample({
      clock: checkStarted,
      source: $user,
      filter: (user) => !user,
    });

    sample({
      clock: checkStarted,
      source: $user,
      filter: Boolean,
      target: routes.home.open,
    });

    return chainRoute({
      route,
      beforeOpen: checkStarted,
      openOn: isAuthenticated,
    });
  };
}
