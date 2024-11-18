import { api } from "@shared/api";

interface Values {
  username: string;
  fullName: string;
  password: string;
}

interface Done {
  success: true;
}

export const signUpFx = api.createRequestEffect<Values, Done>(
  async ({ client, params }) =>
    (await client.post<Done>("/sign-up", params)).data
);
