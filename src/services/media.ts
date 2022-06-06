import { prisma } from '../helpers/database';

export const createMedia = async ({
  telegramMediaId,
  telegramMediaType,
  type,
}: {
  telegramMediaId: string;
  telegramMediaType: string;
  type: string;
}) => {
  return await prisma.media.create({
    data: {
      telegramMediaId,
      telegramMediaType,
      type,
    },
  });
};

export const findMediaByTelegramId = async (telegramMediaId: string) => {
  return await prisma.media.findFirst({
    where: {
      telegramMediaId,
    },
  });
};
