import request from "supertest";
import app from "../app";
import prisma from "../prisma";

describe("Messages API", () => {
  beforeAll(async () => {
    await prisma.message.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /api/messages returns empty array initially", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/messages creates a message", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ sender: "User A", text: "Hello" });

    expect(res.status).toBe(201);
    expect(res.body.sender).toBe("User A");
    expect(res.body.text).toBe("Hello");
  });

  it("POST /api/messages with invalid payload returns 400", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ sender: "", text: "" });

    expect(res.status).toBe(400);
  });
});