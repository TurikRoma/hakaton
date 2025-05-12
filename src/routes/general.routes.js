import express from "express";
import {
  getAllBookings,
  getAllRooms,
} from "../controllers/general.controllers.js";
const generalRouter = express.Router();

generalRouter.get("/rooms", getAllRooms);
generalRouter.get("/bookings", getAllBookings);

export default generalRouter;
