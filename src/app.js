import express from "express";
import AuthRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.routes.js";
import generalRouter from "./routes/general.routes.js";
import serviceRouter from "./routes/service.route.js";
import roomsRouter from "./routes/rooms.route.js";

const app = express();
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api", bookingRouter);
app.use("/api", generalRouter);
app.use("/api", serviceRouter);
app.use("/api", roomsRouter);

export default app;
