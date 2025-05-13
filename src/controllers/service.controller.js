import { prisma } from "../config/env.js";

export const checkBooking = async (userId, currentDate) => {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      userId,
      AND: [
        { startDate: { lt: new Date(currentDate) } },
        { endDate: { gt: new Date(currentDate) } },
      ],
    },
  });
  console.log(overlappingBookings);
  return {
    isBooking: overlappingBookings.length === 0,
    bookingId: overlappingBookings[0],
  };
};

export const orderService = async (req, res) => {
  const userId = req.user.id; // получаем id авторизованного пользователя (из токена)
  const { serviceId } = req.body;

  try {
    // Проверяем, существует ли услуга
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const currentDate = new Date();
    // Проверяем, существует ли бронирование
    const check = await checkBooking(userId, currentDate);
    if (check.isBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const bookingId = check.bookingId.id;
    // Заказываем услугу для пользователя
    const userService = await prisma.userService.create({
      data: {
        userId,
        serviceId,
        bookingId,
      },
    });

    res.status(201).json(userService);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
