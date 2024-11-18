import { ReservationEntity } from "@source/database";
import { Request, Response } from "express";
import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
});

export async function cancelReservationHandler(req: Request, res: Response) {
  const result = await bodySchema.safeParseAsync(req.body);

  if (result.error) {
    res.status(400).json({ reason: "internal" });
    return;
  }

  const reservation = await ReservationEntity.findOne({
    where: { id: result.data.id },
    relations: { user: true },
  });

  if (!reservation) {
    res.status(404).json({ reason: "reservation_not_found" });
    return;
  }

  if (reservation.user.id !== req.user?.id) {
    res.status(405).json({ reason: "access_denied" });
    return;
  }

  await reservation.remove();

  res.status(200).json({ success: true });
}
