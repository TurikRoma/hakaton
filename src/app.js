import express from "express";
import http from "http";
import AuthRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.routes.js";
import generalRouter from "./routes/general.routes.js";
import serviceRouter from "./routes/service.route.js";
import roomsRouter from "./routes/rooms.route.js";
import messageRoute from "./routes/message.route.js";
import { initWebSocketServer } from "./websocket/websocket.js";

const app = express();
const server = http.createServer(app);
app.use(cors());

app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api", bookingRouter);
app.use("/api", generalRouter);
app.use("/api", serviceRouter);
app.use("/api", roomsRouter);
app.use("/api", messageRoute);

initWebSocketServer(server);

export default app;
