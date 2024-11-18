import {
  attach,
  createEffect,
  createEvent,
  createStore,
  Effect,
  sample,
} from "effector";
import axios, { AxiosError, AxiosInstance } from "axios";

import { persist } from "effector-storage/local";
import { appStarted } from "@shared/effector";

export type ApiError = AxiosError<{ reason: string }>;
type HandlerParams<Params> = { client: AxiosInstance; params: Params };

type RequestHandler<Params, Done> = (
  params: HandlerParams<Params>
) => Promise<Done>;

function createApiModel() {
  const maybeToken = localStorage.getItem("token");

  const $client = createStore(
    axios.create({
      baseURL: import.meta.env["VITE_BACKEND_URL"],
      headers: maybeToken
        ? {
            common: {
              Authorization: JSON.parse(maybeToken),
            },
          }
        : undefined,
    })
  );

  const $token = createStore<string | null>(null);

  const signIn = createEvent<{ token: string }>();
  const logout = createEvent();
  const logouted = createEvent();

  const createRequestEffect = <Params, Done>(
    handler: RequestHandler<Params, Done>
  ): Effect<Params, Done, ApiError> => {
    const fx = attach({
      source: $client,
      mapParams: (params: Params, client) => ({ client, params }),
      effect: createEffect<HandlerParams<Params>, Done, ApiError>(handler),
    });

    sample({
      clock: fx.failData,
      filter: (error: ApiError) => error.status === 401,
      fn: () => null,
      target: $token,
    });

    return fx;
  };

  const setTokenFx = attach({
    source: $client,
    effect: (client, token: string | null) => {
      if (token) {
        client.defaults.headers.common.Authorization = token;
      } else {
        delete client.defaults.headers.common.Authorization;
      }
    },
  });

  persist({
    store: $token,
    key: "token",
    pickup: appStarted,
  });

  sample({
    clock: $token,
    target: setTokenFx,
  });

  sample({
    clock: setTokenFx.done,
    filter: ({ params }) => !params,
    target: logouted,
  });

  sample({
    clock: signIn,
    fn: ({ token }) => token,
    target: $token,
  });

  sample({
    clock: logout,
    fn: () => null,
    target: $token,
  });

  return { createRequestEffect, signIn, logout, logouted };
}

export const api = createApiModel();
