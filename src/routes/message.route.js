import express from "express";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import {
  AddMessage,
  GetMessagesById,
} from "../controllers/message.controller.js";
const messageRoute = express.Router();

messageRoute.post("/add/message", authMiddleware, AddMessage);
messageRoute.get("/get/messages", authMiddleware, GetMessagesById);

export default messageRoute;
