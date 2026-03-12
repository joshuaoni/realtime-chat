import { Router } from "express";
import {
  getMessagesHandler,
  createMessageHandler
} from "../controllers/messageController";
import { validateMessage } from "../middleware/validateMessage";

const router = Router();

router.get("/messages", getMessagesHandler);
router.post("/messages", validateMessage, createMessageHandler);

export default router;