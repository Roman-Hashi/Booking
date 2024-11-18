import { Request } from "express";
import { RouteInfo } from "./types";

export function isPrivateRoute(routes: RouteInfo[], req: Request) {
  return Boolean(
    routes.find(
      ({ method, route }) => method === req.method && route === req.path
    )
  );
}
