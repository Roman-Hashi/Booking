import { ReservationEntity, SchemaEntity, SeatEntity } from "@source/database";
import * as unix from "@utils/unix";
import { Request, Response } from "express";
import { And, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { z } from "zod";

const bodySchema = z.object({
  seatId: z.number(),
  from: z.number(),
  to: z.number(),
});

export async function reserveHandler(req: Request, res: Response) {
  const result = await bodySchema.safeParseAsync(req.body);

  if (result.error) {
    res.status(400).json({ reason: "internal" });
    return;
  }

  const { data } = result;
  const now = unix.now();

  if (data.from < now || data.from >= data.to) {
    res.status(400).json({ reason: "internal" });
    return;
  }

  const seat = await SeatEntity.findOne({
    where: {
      id: data.seatId,
    },
    relations: {
      reservations: {
        user: true,
      },
    },
  });

  if (!seat) {
    res.status(400).json({ reason: "seat_not_found" });
    return;
  }

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

  if (reservations.length > 0) {
    res.status(400).json({ reason: "seat_busy" });
    return;
  }

  const reservation = new ReservationEntity({
    user: req.user!,
    fromTime: data.from,
    toTime: data.to,
    seat,
  });

  await reservation.save();

  res.status(200).json({
    id: reservation.id,
    from: reservation.fromTime,
    to: reservation.toTime,
    seat: { id: seat.id, position: seat.position },
  });
}
