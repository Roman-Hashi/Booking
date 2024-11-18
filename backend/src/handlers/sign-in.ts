import { Request, Response } from "express";
import { UserEntity } from "../source/database/entities/user.entity";
import { createHash } from "crypto";

import jsonwebtoken from "jsonwebtoken";
import { z } from "zod";

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function signInHandler(req: Request, res: Response) {
  const result = await bodySchema.safeParseAsync(req.body);

  if (result.error) {
    res.status(400).json({ reason: "internal" });
    return;
  }

  const { data } = result;

  const user = await UserEntity.findOne({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    res.status(401).json({ reason: "not_exists" });
    return;
  }

  const hashedPass = createHash("sha256").update(data.password).digest("hex");

  if (user.password !== hashedPass) {
    res.status(401).json({ reason: "wrong_data" });
    return;
  }

  res.status(200).json({
    token: jsonwebtoken.sign(
      { id: user.id },
      import.meta.env["VITE_JWT_SECRET"],
      {
        expiresIn: "1y",
      }
    ),
  });
}
