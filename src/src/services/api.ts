import type { Message } from "../types";
import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL + "/api";

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${API_BASE_URL}/messages`);
  if (!res.ok) {
    throw new Error("Failed to load messages");
  }
  return res.json();
}

export async function postMessage(sender: string, text: string): Promise<Message> {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, text })
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}