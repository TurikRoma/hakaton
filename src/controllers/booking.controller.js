import { prisma } from "../config/env.js";
import { generateKey } from "../utils/keyGenerator.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // получаем id авторизованного пользователя (из токена)
    const { startDate, endDate } = req.body;

    const AvaiableRooms = await prisma.room.findMany({
      where: {
        bookings: {
          none: {
            AND: [
              { startDate: { lt: new Date(endDate) } },
              { endDate: { gt: new Date(startDate) } },
            ],
          },
        },
      },
      select: {
        id: true,
        number: true,
      },
    });

    if (AvaiableRooms.length == 0)
      return res
        .status(400)
        .json({ message: "No available rooms", AvaiableRooms });

    // 2. Создание бронирования
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: AvaiableRooms[0].id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // 3. Генерация digital ключа
    const keyString = await generateKey(); // генерим ключ

    const digitalKey = await prisma.digitalKey.create({
      data: {
        key: keyString,
        userId,
        bookingId: booking.id,
        roomId: AvaiableRooms[0].id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // 4. Ответ пользователю
    return res.status(201).json({
      message: "Бронирование успешно",
      booking,
      digitalKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
