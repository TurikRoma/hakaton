import { prisma } from "../config/env.js";

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });

  const currentDay = new Date();

  const booking = await prisma.booking.findMany({
    where: { userId: req.user.id },
  });

  user["bookings"] = booking;
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
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

export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getAllServices = async (req, res) => {
//   try {
//     const services = await prisma.userService.findMany({
//       include: {
//         user: true,
//         service: true, // Включаем информацию о самой услуге
//         booking: true, // Включаем информацию о бронировании
//       },
//     });
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
