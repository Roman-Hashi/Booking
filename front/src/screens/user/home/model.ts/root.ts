import { createStore, sample } from "effector";
import { createGate } from "effector-react";
import { getSchemaFx, Schema } from "../api";

export const HomeGate = createGate();

export const $isLoading = createStore(true);
export const $schema = createStore<Schema | null>(null);

sample({
  clock: HomeGate.open,
  target: getSchemaFx,
});

sample({
  clock: getSchemaFx.doneData,
  target: $schema,
});

sample({
  clock: getSchemaFx.doneData,
  fn: () => false,
  target: $isLoading,
});
