import { Request, Response } from "express";

export async function profileHandler(req: Request, res: Response) {
  const user = req.user!;

  res.status(200).json({
    id: user.id,
    fullName: user.fullName,
    username: user.username,
  });
}
