import { createForm } from "@effector-reform/core";
import { zodAdapter } from "@effector-reform/zod";
import { sample } from "effector";
import { z } from "zod";
import { signUpFx } from "../api";
import { routes } from "@shared/routing";
import { notifications } from "@shared/libs/notifications";

export const signUpForm = createForm({
  schema: {
    username: "",
    fullName: "",
    password: "",
  },
  validation: zodAdapter(
    z.object({
      username: z
        .string({ required_error: "field is required." })
        .min(4, "username must contain at least 4 characters")
        .max(32, "username must contain at most 32 characters"),

      fullName: z
        .string({ required_error: "field is required." })
        .min(4, "full name must contain at least 4 characters")
        .max(64, "full name must contain at most 64 characters"),

      password: z
        .string({ required_error: "field is required." })
        .min(8, "password must contain at least 8 characters")
        .max(64, "password must contain at most 64 characters"),
    })
  ),
});
sample({
  clock: signUpForm.validatedAndSubmitted,
  target: signUpFx,
});

sample({
  clock: signUpFx.doneData,
  target: [
    routes.signIn.open,
    notifications.success.prepend(() => ({
      title: "Successfully created account",
      message: "Now you can authorize with your credentials",
    })),
  ],
});
