import { SchemaEntity, SeatEntity } from "@source/database";
import { Request, Response } from "express";

export async function getSchemaHandler(req: Request, res: Response) {
  const schema = await SchemaEntity.findOne({
    where: {
      id: 1,
    },
  });

  if (!schema) {
    res.status(500).json({ reason: "internal" });
    return;
  }

  let resultSchema: any = {
    title: schema.title,
    imageUrl: schema.url,
  };

  const seats = await SeatEntity.find({
    where: { schema: { id: schema.id } },
    relations: { schema: true },
  });

  resultSchema.seats = [];

  for (const seat of seats) {
    resultSchema.seats.push({
      id: seat.id,
      position: seat.position,
    });
  }

  res.status(200).json(resultSchema);
}
