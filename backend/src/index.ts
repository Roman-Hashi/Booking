import "reflect-metadata";

import express from "express";

import { authGuard } from "@middlewares/auth-guard";

import { setupDatabase } from "@source/database";

import { getSchemaHandler } from "@handlers/get-schema";
import { signInHandler } from "@handlers/sign-in";
import { signUpHandler } from "@handlers/sign-up";
import { reserveHandler } from "@handlers/reserve";
import { cancelReservationHandler } from "@handlers/cancel-reservation";
import { profileHandler } from "@handlers/profile";
import bodyParser from "body-parser";
import { getReservationsHandler } from "@handlers/get-reservations";

setupDatabase();

export const app = express();

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

app.use(
  authGuard({
    guardedRoutes: [
      { method: "POST", route: "/api/create-schema" },
      { method: "POST", route: "/api/edit-schema" },
      { method: "POST", route: "/api/reserve" },
      { method: "POST", route: "/api/cancel-reservation" },
      { method: "GET", route: "/api/get-schema" },
      { method: "GET", route: "/api/profile" },
    ],
  })
);

app.get("/api/get-schema", getSchemaHandler);
app.get("/api/get-reservations", getReservationsHandler);

app.post("/api/sign-in", signInHandler);
app.post("/api/sign-up", signUpHandler);

app.get("/api/profile", profileHandler);

app.post("/api/reserve", reserveHandler);
app.post("/api/cancel-reservation", cancelReservationHandler);

if (import.meta.env.PROD) {
  app.listen(import.meta.env["VITE_APP_PORT"], () =>
    console.log(
      `back-end listening on port ${import.meta.env["VITE_APP_PORT"]}`
    )
  );
}
