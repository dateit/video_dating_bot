import Joi from 'joi';
import { Gender, User, Prisma } from '@prisma/client';

import { prisma } from '../helpers/database';

export const findOrCreateUser = async (_telegramId: number, username?: string, languageCode?: string) => {
  const telegramId = String(_telegramId);

  return await prisma.user.upsert({
    where: { telegramId },
    update: { lastActivity: new Date().toISOString() },
    create: { telegramId, username, language: languageCode },
  });
};

export const findUser = async (id: string) => {
  return await prisma.user.findFirst({ where: { id } });
};

/**
 * @param {string | number} telegramInfo - Telegram user id or username
 */
export const findUserByTelegram = async (telegramInfo: number | string) => {
  return await prisma.user.findFirst({
    where: { OR: [{ telegramId: String(telegramInfo) }, { username: String(telegramInfo) }] },
    include: {
      _count: {
        select: { Reports: true },
      },
    },
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

  const baseCondition: Prisma.UserWhereInput = {
    id: {
      not: id,
    },
    gender: lookingFor,
    lookingFor: gender,
    videoNoteId: {
      // eslint-disable-next-line unicorn/no-null
      not: null,
    },
    // Only when no report to found
    Reports: {
      none: {},
    },
    // User's like no found
    Liked: {
      every: {
        likerId: {
          not: id,
        },
      },
    },
  };

  const likedCurrentUser = await prisma.user.findFirst({
    where: {
      ...baseCondition,
      Liker: {
        some: {
          likedId: id,
          dislike: false,
          mutual: false,
        },
      },
    },
  });

  if (likedCurrentUser) {
    return likedCurrentUser;
  }

  return await prisma.user.findFirst({
    where: {
      ...baseCondition,
      // Found didn't dislike user and like still doesn't mark as mutual
      Liker: {
        every: {
          NOT: {
            OR: [
              {
                likedId: id,
                dislike: true,
              },
              {
                likedId: id,
                mutual: true,
              },
            ],
          },
        },
      },
    },
    orderBy: [
      {
        lastActivity: 'desc',
      },
      {
        Liker: {
          _count: 'desc',
        },
      },
    ],
  });
};

export const findMutualLikedUsers = async (user: User) => {
  const { id } = user;

  // eslint-disable-next-line unicorn/no-array-reduce
  return await prisma.likes.findMany({
    where: {
      OR: [
        {
          likedId: id,
        },
        {
          likerId: id,
        },
      ],
      AND: {
        mutual: true,
      },
    },
    include: {
      liked: true,
      liker: true,
    },
  });
};

export const usersInfo = async () => {
  return {
    usersCount: await prisma.user.count(),
    mansCount: await prisma.user.count({ where: { gender: Gender.MALE } }),
    womansCount: await prisma.user.count({ where: { gender: Gender.FEMALE } }),
    likesCount: await prisma.likes.count(),
    mutualLikesCount: await prisma.likes.count({ where: { mutual: true } }),
  };
};

export const ageValidator = Joi.number().min(18).max(100).required();
