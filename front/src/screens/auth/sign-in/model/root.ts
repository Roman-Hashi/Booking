import { createForm } from "@effector-reform/core";
import { zodAdapter } from "@effector-reform/zod";
import { sample, split } from "effector";
import { z } from "zod";
import { signInFx } from "../api";
import { api, ApiError } from "@shared/api";
import { notifications } from "@shared/libs/notifications";
import { routes } from "@shared/routing";
import { combineEvents } from "patronum";
import { getProfileFx } from "@shared/user/api";

const signInNotifications = {
  notExists: notifications.error.prepend(() => ({
    title: "User doesn't exists",
    message: "Please try another username",
  })),

  wrongData: notifications.error.prepend(() => ({
    title: "Wrong login or password",
    message: "Please try another login or password",
  })),

  internal: notifications.error.prepend(() => ({
    title: "Internal error",
    message: "Please try again later",
  })),
};

export const signInForm = createForm({
  schema: {
    username: "",
    password: "",
  },
  validation: zodAdapter(
    z.object({
      username: z.string().min(1, "username is required"),
      password: z.string().min(1, "password is required"),
    })
  ),
});

sample({
  clock: signInForm.validatedAndSubmitted,
  target: signInFx,
});

sample({
  clock: signInFx.doneData,
  target: [api.signIn, getProfileFx],
});

sample({
  clock: combineEvents([api.signIn, getProfileFx.doneData]),
  target: routes.home.open,
});

split({
  source: signInFx.failData,
  match: (error: ApiError) => error.response?.data.reason ?? "internal",
  cases: {
    not_exists: signInNotifications.notExists,
    wrong_data: signInNotifications.wrongData,
    internal: signInNotifications.internal,
    __: signInNotifications.internal,
  },
});
