import { ReservationEntity } from "@source/database";
import { Request, Response } from "express";
import { And, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { z } from "zod";

const querySchema = z.object({
  seatId: z.coerce.number(),
  from: z.coerce.number(),
  to: z.coerce.number(),
});

export async function getReservationsHandler(req: Request, res: Response) {
  const result = await querySchema.safeParseAsync(req.query);

  if (result.error) {
    res.status(403).json({ reason: "internal" });
    return;
  }

  const { data } = result;

  const reservations = await ReservationEntity.find({
    where: [
      {
        seat: { id: data.seatId },
        fromTime: LessThanOrEqual(data.from),
        toTime: And(MoreThanOrEqual(data.from), LessThanOrEqual(data.to)),
      },
      {
        seat: { id: data.seatId },
        fromTime: And(MoreThanOrEqual(data.from), LessThanOrEqual(data.to)),
        toTime: MoreThanOrEqual(data.to),
      },
      {
        seat: { id: data.seatId },
        fromTime: MoreThanOrEqual(data.from),
        toTime: LessThanOrEqual(data.to),
      },
      {
        seat: { id: data.seatId },
        fromTime: LessThanOrEqual(data.from),
        toTime: MoreThanOrEqual(data.to),
      },
    ],
    relations: {
      seat: true,
      user: true,
    },
  });

  res.status(200).json(
    reservations.map((reservation) => ({
      id: reservation.id,
      user: { id: reservation.user.id, fullName: reservation.user.fullName },
      from: reservation.fromTime,
      to: reservation.toTime,
    }))
  );
}
