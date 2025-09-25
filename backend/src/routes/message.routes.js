import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, sendMessage);

router.get("/:conversationId", isAuthenticated, getMessages);

export default router;
