import { prisma } from "../config/env.js";

export const AddRoom = async (req, res) => {
  const { UserId } = req.user.id;
  const UserRole = req.user.role;
  const { roomNumber, price, type, description } = req.body;

  if (UserRole != "ADMIN") {
    return res.status(403).json({ message: "not enough rights" });
  }

  const room = await prisma.room.findMany({
    where: { number: roomNumber },
  });
  if (room.length != 0) {
    return res.status(403).json({ message: "Room already exists" });
  }

  const newRoom = await prisma.room.create({
    data: { number: roomNumber, status: true, type, description, price },
  });

  res.json({ newRoom });
};

export const changeStatusRoom = async (req, res) => {
  const { UserId } = req.user.id;
  const UserRole = req.user.role;
  const { status, roomNumber } = req.body;

  if (UserRole != "ADMIN") {
    return res.status(403).json({ message: "not enough rights" });
  }

  const room = await prisma.room.findMany({
    where: { number: roomNumber },
  });
  if (room.length == 0) {
    return res.status(403).json({ message: "Room doesn't exist" });
  }

  const newRoom = await prisma.room.update({
    where: { number: roomNumber },
    data: { status },
  });

  res.json({ newRoom });
};
