import { Server as HTTPServer } from "http";
import { AddressInfo } from "net";
import { io as Client, Socket } from "socket.io-client";
import { Server as SocketIOServer } from "socket.io";
import app from "../app";
import { registerChatSocket } from "../sockets/chatSocket";
import prisma from "../prisma";

describe("Socket.io chat", () => {
  let httpServer: HTTPServer;
  let ioServer: SocketIOServer;
  let clientSocket1: Socket;
  let clientSocket2: Socket;
  let port: number;

  beforeAll(done => {
    httpServer = new HTTPServer(app);
    ioServer = new SocketIOServer(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });
    registerChatSocket(ioServer);

    httpServer.listen(() => {
      port = (httpServer.address() as AddressInfo).port;
      const url = `http://localhost:${port}`;

      clientSocket1 = Client(url);
      clientSocket2 = Client(url);

      let connected = 0;
      function onConnect() {
        connected += 1;
        if (connected === 2) {
          done();
        }
      }

      clientSocket1.on("connect", onConnect);
      clientSocket2.on("connect", onConnect);
    });
  });

  afterAll(async () => {
    clientSocket1.disconnect();
    clientSocket2.disconnect();
    ioServer.close();
    httpServer.close();
    await prisma.message.deleteMany();
    await prisma.$disconnect();
  });

  it("broadcasts message to all clients", done => {
    const payload = { sender: "User A", text: "Hello via socket" };

    const handler = (msg: any) => {
      if (msg.sender === "System") return; // Ignore join message
      try {
        expect(msg.sender).toBe(payload.sender);
        expect(msg.text).toBe(payload.text);
        clientSocket2.off("message", handler);
        done();
      } catch (err) {
        done(err as Error);
      }
    };

    clientSocket2.on("message", handler);
    clientSocket1.emit("sendMessage", payload);
  }, 15000);

  it("sends error message for invalid payload", done => {
    const invalidPayload = { sender: "", text: "" };

    clientSocket1.once("errorMessage", (errorMsg: any) => {
      try {
        expect(errorMsg.error).toBe("sender and text are required");
        done();
      } catch (err) {
        done(err as Error);
      }
    });

    clientSocket1.emit("sendMessage", invalidPayload);
  }, 15000);

  it("broadcasts user typing", done => {
    clientSocket2.once("userTyping", (username: string) => {
      try {
        expect(username).toBe("User A");
        done();
      } catch (err) {
        done(err as Error);
      }
    });
    clientSocket1.emit("typing", "User A");
  });

  it("broadcasts user stopped typing", done => {
    clientSocket2.once("userStoppedTyping", () => {
      done();
    });
    clientSocket1.emit("stopTyping");
  });

  it("broadcasts usersUpdate and join message on join", done => {
    clientSocket1.once("usersUpdate", (users: string[]) => {
      try {
        expect(users).toContain("Alex");
        done();
      } catch (err) {
        done(err as Error);
      }
    });

    clientSocket1.emit("join", "Alex");
  });

  it("broadcasts left message on disconnect", done => {
    const tempSocket = Client(`http://localhost:${port}`);
    tempSocket.on("connect", () => {
      tempSocket.emit("join", "Leaver");

      clientSocket1.on("message", (msg: any) => {
        if (msg.sender === "System" && msg.text.includes("Leaver left")) {
          clientSocket1.off("message");
          done();
        }
      });

      tempSocket.disconnect();
    });
  });
});