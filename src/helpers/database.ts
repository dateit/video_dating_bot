import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { getCurrentHub } from '@sentry/node';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
});

prisma.$use(async (parameters, next) => {
  const { model, action, runInTransaction, args } = parameters;
  const description = [model, action].filter(Boolean).join('.');
  const data = {
    model,
    action,
    runInTransaction,
    args,
  };

  const transaction = getCurrentHub().getScope().getTransaction();

  const span = transaction?.startChild({
    op: 'db',
    description,
    data,
  });

  const result = await next(parameters);
  span?.finish();

  return result;
});

export const initDatabase = async (app: FastifyInstance) => {
  try {
    await prisma.$connect();
    app.log.info('Database connected!');
  } catch (error) {
    app.log.error(`Error with database connection: ${error}`);
  }
};

export const stopDatabase = () => {
  return prisma.$disconnect();
};
