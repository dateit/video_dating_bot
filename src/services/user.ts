import Joi from 'joi';
import { User } from '@prisma/client';

import { prisma } from '../helpers/database';

export const findOrCreateUser = async (_telegramId: number, username?: string, languageCode?: string) => {
  const telegramId = String(_telegramId);

  return await prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: { telegramId, username, language: languageCode },
  });
};

export const findUser = async (id: string) => {
  return await prisma.user.findFirst({ where: { id } });
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
      likerId: id,
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

export const findMutualLikedUsers = async (user: User): Promise<Array<User>> => {
  const { id } = user;

  const mutualLikedUsers = await prisma.likes.findMany({
    where: {
      OR: [
        {
          likedId: id,
        },
        {
          likerId: id,
        },
      ],
      mutual: true,
    },
    include: {
      liked: true,
      liker: true,
    },
  });

  // eslint-disable-next-line unicorn/no-array-reduce
  return mutualLikedUsers.reduce((accumulator, { liker, liked }) => {
    if (liker.id !== id) {
      accumulator.push(liker);
    } else {
      accumulator.push(liked);
    }

    return accumulator;
  }, [] as Array<User>);
};

export const ageValidator = Joi.number().min(18).max(100).required();
