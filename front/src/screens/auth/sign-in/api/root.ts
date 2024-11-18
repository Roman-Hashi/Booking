import { api, ApiError } from "@shared/api";

interface Params {
  username: string;
  password: string;
}

interface Done {
  token: string;
}

export const signInFx = api.createRequestEffect<Params, Done>(
  async ({ client, params }) => {
    try {
      const result = await client.post<Done>("/sign-in", params);

      return result.data;
    } catch (e) {
      const error = e as ApiError;

      return Promise.reject(error.response?.data);
    }
  }
);
