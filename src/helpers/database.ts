import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
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
