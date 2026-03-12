import { Server, Socket } from "socket.io";
import { createMessage } from "../services/messageService";
import { MessagePayload } from "../types/message";

const onlineUsers = new Map<string, string>(); // socketId -> username

export function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    // eslint-disable-next-line no-console
    console.log("Client connected", socket.id);

    socket.on("join", (username: string) => {
      if (onlineUsers.has(socket.id)) return;

      onlineUsers.set(socket.id, username);

      // Broadcast user list
      io.emit("usersUpdate", Array.from(new Set(onlineUsers.values())));

      // System message
      io.emit("message", {
        id: `system-${Date.now()}`,
        sender: "System",
        text: `${username} joined the chat.`,
        createdAt: new Date().toISOString(),
        isSystem: true
      });
    });

    socket.on("sendMessage", async (payload: MessagePayload) => {
      const { sender, text } = payload;

      if (!sender || !text) {
        socket.emit("errorMessage", {
          error: "sender and text are required"
        });
        return;
      }

      try {
        const message = await createMessage({ sender, text });
        io.emit("message", message);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        socket.emit("errorMessage", { error: "Failed to save message" });
      }
    });

    socket.on("typing", (username: string) => {
      socket.broadcast.emit("userTyping", username);
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("userStoppedTyping");
    });

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);

      io.emit("usersUpdate", Array.from(new Set(onlineUsers.values())));

      if (username) {
        io.emit("message", {
          id: `system-${Date.now()}`,
          sender: "System",
          text: `${username} left the chat.`,
          createdAt: new Date().toISOString(),
          isSystem: true
        });
      }

      // eslint-disable-next-line no-console
      console.log("Client disconnected", socket.id);
    });
  });
}