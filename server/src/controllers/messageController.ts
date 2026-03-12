import { Request, Response } from "express";
import { getMessages, createMessage } from "../services/messageService";

export async function getMessagesHandler(_req: Request, res: Response) {
  const messages = await getMessages();
  return res.json(messages);
}

export async function createMessageHandler(req: Request, res: Response) {
  const { sender, text } = req.body as { sender?: string; text?: string };

  if (!sender || !text) {
    return res.status(400).json({ error: "sender and text are required" });
  }

  const message = await createMessage({ sender, text });
  return res.status(201).json(message);
}