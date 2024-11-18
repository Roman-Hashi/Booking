/// <reference types="vite/client" />

import { Request } from "express";
import { UserEntity } from "@source/database";

declare module "express" {
  interface Request {
    user?: UserEntity | null;
  }
}

export {};
