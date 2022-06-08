import sample from 'lodash/sample';
import random from 'lodash/random';

import { prisma } from '../helpers/database';

export const getRandomQuestions = async (min = 5, max = 10) => {
  const order = sample(['desc', 'asc'] as const);
  const field = sample(['id', 'question', 'createdAt'] as const);

  const take = random(min, max);

  return await prisma.welcomeQuestions.findMany({
    orderBy: {
      [field]: order,
    },
    take,
  });
};
