import { prisma } from "../config/env.js";
import { checkRoomAvailability } from "../services/bookingService.js";
import { generateKey } from "../utils/keyGenerator.js";

const definingRoomId = async (roomName) => {
  const room = await prisma.room.findUnique({ where: { number: roomName } });
  return room.id;
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // получаем id авторизованного пользователя (из токена)
    const { room, startDate, endDate } = req.body;

    const roomId = await definingRoomId(room);

    // 1. Проверка: доступна ли комната на указанные даты
    const isAvailable = await checkRoomAvailability(roomId, startDate, endDate);

    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Комната недоступна на выбранные даты" });
    }

    // 2. Создание бронирования
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
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
        roomId,
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
