import { prisma } from "../config/env.js";

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        bookings: true,
        digitalKeys: true,
      },
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        room: true,
        services: {
          include: {
            service: true,
          },
        },
        digitalKeys: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
