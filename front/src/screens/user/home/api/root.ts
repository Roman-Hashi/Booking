import { api } from "@shared/api";
import { Reservation, Schema } from "./types";

export const getSchemaFx = api.createRequestEffect(
  async ({ client }) =>
    (
      await client.get<Schema>("/get-schema", {
        params: { time: Math.ceil(new Date().getTime() / 1000) },
      })
    ).data
);

export const getReservationsFx = api.createRequestEffect<
  { seatId: number; from: Date; to: Date },
  Reservation[]
>(
  async ({ client, params }) =>
    (
      await client.get<Reservation[]>("/get-reservations", {
        params: {
          seatId: params.seatId,
          from: Math.ceil(params.from.getTime() / 1000),
          to: Math.ceil(params.to.getTime() / 1000),
        },
      })
    ).data
);

export const reserveFx = api.createRequestEffect<
  { seatId: number; from: Date; to: Date },
  { success: true }
>(
  async ({ client, params }) =>
    (
      await client.post<{ success: true }>("/reserve", {
        seatId: params.seatId,
        from: Math.ceil(params.from.getTime() / 1000),
        to: Math.ceil(params.to.getTime() / 1000),
      })
    ).data
);
