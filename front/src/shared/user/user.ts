import { appStarted } from "@shared/effector";
import { User } from "@shared/types";
import { createStore, sample } from "effector";
import { getProfileFx } from "./api";
import { api } from "@shared/api";
import { routes } from "@shared/routing";

export const $user = createStore<User>(null as unknown as User);

sample({
  clock: appStarted,
  target: getProfileFx,
});

sample({
  clock: getProfileFx.doneData,
  target: $user,
});

sample({
  clock: api.logouted,
  fn: () => null as unknown as User,
  target: [$user, routes.signIn.open],
});
