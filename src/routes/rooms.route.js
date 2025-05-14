import express from "express";
import { AddRoom, changeStatusRoom } from "../controllers/rooms.controller.js";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
const roomsRouter = express.Router();

roomsRouter.post("/add/room", authMiddleware, AddRoom);
roomsRouter.post("/changeStatus/room", authMiddleware, changeStatusRoom);

export default roomsRouter;
