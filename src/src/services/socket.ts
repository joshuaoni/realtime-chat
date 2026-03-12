import { io, Socket } from "socket.io-client";
import type { Message } from "../types";
import { env } from "../config/env";

const SOCKET_URL = env.API_BASE_URL;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function joinChat(username: string) {
  getSocket().emit("join", username);
}

export function sendSocketMessage(sender: string, text: string) {
  const s = getSocket();
  s.emit("sendMessage", { sender, text });
}

export function subscribeToMessages(callback: (msg: Message) => void) {
  const s = getSocket();
  s.on("message", callback);
  return () => {
    s.off("message", callback);
  };
}

export function subscribeToUsers(callback: (users: string[]) => void) {
  const s = getSocket();
  s.on("usersUpdate", callback);
  return () => {
    s.off("usersUpdate", callback);
  };
}

export function sendTyping(username: string) {
  getSocket().emit("typing", username);
}

export function sendStopTyping() {
  getSocket().emit("stopTyping");
}

export function subscribeToTyping(onTyping: (user: string) => void, onStop: () => void) {
  const s = getSocket();
  s.on("userTyping", onTyping);
  s.on("userStoppedTyping", onStop);
  return () => {
    s.off("userTyping", onTyping);
    s.off("userStoppedTyping", onStop);
  };
}