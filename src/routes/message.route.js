import express from "express";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import {
  AddMessage,
  AllServices,
  ChangeServicesStatus,
  GetMessagesById,
  GetQuestion,
} from "../controllers/message.controller.js";
const messageRoute = express.Router();

messageRoute.post("/add/message", authMiddleware, AddMessage);
messageRoute.get("/get/messages", authMiddleware, GetMessagesById);
messageRoute.get("/get/question", authMiddleware, GetQuestion);
messageRoute.get("/get/allServices", authMiddleware, AllServices);
messageRoute.get("/changeStatusServices", authMiddleware, ChangeServicesStatus);

export default messageRoute;
