import express from "express";
import {
  getAllBookings,
  getAllRooms,
  getAllServices,
} from "../controllers/general.controllers.js";
const generalRouter = express.Router();

generalRouter.get("/rooms", getAllRooms);
generalRouter.get("/bookings", getAllBookings);
generalRouter.get("/services", getAllServices);

export default generalRouter;
