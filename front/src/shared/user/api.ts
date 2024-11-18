import { api } from "@shared/api";
import { User } from "@shared/types";

export const getProfileFx = api.createRequestEffect(
  async ({ client }) => (await client.get<User>("/profile")).data
);
