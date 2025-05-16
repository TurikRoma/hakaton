import app from "./app.js";
import { PORT } from "./config/env.js";
import { initWebSocketServer } from "./websocket/websocket.js";
import http from "http";

const server = http.createServer(app);

initWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
