import prisma from "../prisma";
import { MessagePayload } from "../types/message";

export async function getMessages() {
  return prisma.message.findMany({
    orderBy: { createdAt: "asc" }
  });
}

export async function createMessage(data: MessagePayload) {
  return prisma.message.create({
    data
  });
}