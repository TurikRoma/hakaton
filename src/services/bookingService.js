import { prisma } from "../config/env.js";

// Проверка доступности комнаты на указанные даты
export const checkRoomAvailability = async (roomId, startDate, endDate) => {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      AND: [
        { startDate: { lt: new Date(endDate) } },
        { endDate: { gt: new Date(startDate) } },
      ],
    },
  });

  return overlappingBookings.length === 0;
};
