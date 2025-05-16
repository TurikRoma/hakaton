import { prisma } from "../config/env.js";
import { notifyUser } from "../websocket/websocket.js";

export const AddMessage = async (req, res) => {
  const UserId = req.user.id;
  const UserRole = req.user.role;
  const { content, adminReceiverId = 0 } = req.body;

  let newMessage;
  const currentDate = new Date();
  if (UserRole == "ADMIN") {
    newMessage = await prisma.message.create({
      data: {
        senderId: UserId,
        receiverId: adminReceiverId,
        content,
        createdAt: currentDate,
      },
    });
    notifyUser(adminReceiverId, {
      type: "new_message",
      message: newMessage,
    });
  } else {
    newMessage = await prisma.message.create({
      data: {
        senderId: UserId,
        receiverId: UserId,
        content,
        createdAt: currentDate,
      },
    });
  }

  res.json({ newMessage });
};

export const GetMessagesById = async (req, res) => {
  const UserId = req.user.id;

  console.log(UserId);

  const messages = await prisma.message.findMany({
    where: {
      receiverId: UserId, // Вопросы и ответы, адресованные пользователю
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: true, // Чтобы видеть кто отправитель (пользователь или админ)
    },
  });

  if (messages.length == 0)
    return res.status(403).json({ message: "No messages" });

  res.json({ messages });
};
