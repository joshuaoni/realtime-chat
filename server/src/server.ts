import { env } from "./config/env";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { registerChatSocket } from "./sockets/chatSocket";

const port = env.PORT;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

registerChatSocket(io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});

export { server, io };