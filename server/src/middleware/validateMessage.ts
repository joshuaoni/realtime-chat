import { Request, Response, NextFunction } from "express";

export function validateMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sender, text } = req.body as { sender?: string; text?: string };

  if (!sender || !text) {
    return res.status(400).json({ error: "sender and text are required" });
  }

  return next();
}