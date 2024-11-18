import { Request, Response } from "express";
import { z } from "zod";
import { UserEntity } from "@source/database";

const bodySchema = z.object({
  username: z.string().min(4).max(32),
  fullName: z.string().min(4).max(64),
  password: z.string().min(8).max(64),
});

export async function signUpHandler(req: Request, res: Response) {
  const result = await bodySchema.safeParseAsync(req.body);

  if (result.error) {
    res.status(400).json({ reason: "internal" });
    return;
  }

  const { data } = result;

  let user = await UserEntity.findOne({
    where: {
      username: data.username,
    },
  });

  if (user) {
    res.status(400).json({ reason: "username_busy" });
    return;
  }

  user = new UserEntity({
    ...data,
  });

  await user.save();

  res.status(200).json({ success: true });
}
