import express from "express";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import { orderService } from "../controllers/service.controller.js";
const serviceRouter = express.Router();

serviceRouter.post("/booking/services", authMiddleware, orderService);

export default serviceRouter;
