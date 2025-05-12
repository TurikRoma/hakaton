import express from "express";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import { createBooking } from "../controllers/booking.controller.js";
const bookingRouter = express.Router();

bookingRouter.post("/booking", authMiddleware, createBooking);

export default bookingRouter;
