import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../source/database/entities/user.entity";
import jsonwebtoken from "jsonwebtoken";
import { RouteInfo } from "./types";
import { isPrivateRoute } from "./utils";

interface AuthGuardOptions {
  guardedRoutes: RouteInfo[];
}

async function getUser(jwt: string) {
  const data = jsonwebtoken.verify(
    jwt,
    import.meta.env["VITE_JWT_SECRET"]
  ) as jsonwebtoken.JwtPayload;

  return UserEntity.findOne({
    where: {
      id: data["id"],
    },
  });
}

export function authGuard(options: AuthGuardOptions) {
  const { guardedRoutes } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwt = req.headers["authorization"] as string | undefined;

      if (!isPrivateRoute(guardedRoutes, req)) {
        return next();
      }

      if (!jwt) {
        throw new Error("token is not found");
      }

      req.user = await getUser(jwt);

      if (!req.user) {
        throw new Error("token is invalid");
      }

      next();
    } catch (e) {
      if ((e as Error).message !== "token is not found") {
        console.error(e);
      }

      res.status(401).json({ reason: "internal" });
    }
  };
}
