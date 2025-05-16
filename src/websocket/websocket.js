import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET, prisma } from "../config/env.js";

const clients = new Map(); // userId -> ws connection

export const initWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    // Получаем токен из query-параметров (ws://host:port?token=XXX)
    const params = new URLSearchParams(req.url.replace(/^\/\?/, ""));
    const token = params.get("token");

    if (!token) {
      ws.close(1008, "No token provided");
      return;
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      ws.close(1008, "Invalid token");
      return;
    }

    const userId = payload.id;
    console.log(`User ${userId} connected`);

    // Сохраняем соединение
    clients.set(userId, ws);

    ws.on("message", async (message) => {
      // В данном случае клиенты сами сообщения не отправляют WS — только получают.
      // Но если понадобится — тут ловим сообщения от клиента.
      console.log(`Message from ${userId}: ${message}`);
    });

    ws.on("close", () => {
      console.log(`User ${userId} disconnected`);
      clients.delete(userId);
    });
  });
};

// Уведомление юзера о новом сообщении
export const notifyUser = (userId, messageData) => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(messageData));
  } else {
    console.log(`User ${userId} is not connected`);
  }
};
