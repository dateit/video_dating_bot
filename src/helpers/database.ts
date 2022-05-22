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

  const scope = getCurrentHub().getScope();
  const parentSpan = scope?.getSpan();
  const span = parentSpan?.startChild({
    op: 'db',
    description,
    data,
  });

  // optional but nice
  scope?.addBreadcrumb({
    category: 'db',
    message: description,
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
