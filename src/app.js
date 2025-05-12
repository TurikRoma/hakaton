import express from "express";
import router from "./routes/auth.route.js";
import AuthRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.routes.js";
import generalRouter from "./routes/general.routes.js";
const app = express();
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api", bookingRouter);
app.use("/api", generalRouter);

export default app;
