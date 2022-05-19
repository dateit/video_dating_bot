import { User } from '@prisma/client';

import { prisma } from '../helpers/database';

export const findOrCreateUser = async (_telegramId: number, languageCode?: string) => {
  const telegramId = String(_telegramId);

  return await prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: { telegramId, language: languageCode ?? 'en' },
  });
};

export const updateUser = async (telegramId: number, user: Partial<User>) => {
  const id = String(telegramId);

  return await prisma.user.update({
    where: { telegramId: id },
    data: user,
  });
};

export const getUser = async (telegramId: number) => {
  const id = String(telegramId);

  return await prisma.user.findFirst({
    where: { telegramId: id },
  });
};

export const findUnmatchedUser = async (user: User): Promise<User> => {
  const { id, lookingFor, gender } = user;

  const likes = await prisma.likes.findMany({
    where: {
      likesId: id,
    },
  });

  const excludeIds = [...likes.map(like => like.likedId), ...id];

  return await prisma.user.findFirst({
    where: {
      gender: lookingFor,
      lookingFor: gender,
      id: {
        notIn: excludeIds,
      },
    },
  });
};
