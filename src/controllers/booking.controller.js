import { prisma } from "../config/env.js";
import { generateKey } from "../utils/keyGenerator.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // получаем id авторизованного пользователя (из токена)
    const role = req.user.role;
    const { roomNumber, startDate, endDate, email = 0 } = req.body;

    const AvaiableRooms = await prisma.room.findUnique({
      where: {
        number: roomNumber,
      },
    });

    console.log(AvaiableRooms);
    if (AvaiableRooms.length == 0)
      return res
        .status(400)
        .json({ message: "No available rooms", AvaiableRooms });
    let booking;

    if (role == "ADMIN") {
      const user = await prisma.user.findUnique({
        where: {
          email: email, // Вопросы и ответы, адресованные пользователю
        },
      });
      if (user == []) {
        return res.status(404).json({ message: "user not found" });
      }
      booking = await prisma.booking.create({
        data: {
          userId: user.id,
          roomId: AvaiableRooms.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
    } else {
      console.log(roomNumber);
      booking = await prisma.booking.create({
        data: {
          userId,
          roomId: AvaiableRooms.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
    }

    // 2. Создание бронирования

    // 3. Генерация digital ключа
    const keyString = await generateKey(); // генерим ключ

    const digitalKey = await prisma.digitalKey.create({
      data: {
        key: keyString,
        userId,
        bookingId: booking.id,
        roomId: AvaiableRooms.id,
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
