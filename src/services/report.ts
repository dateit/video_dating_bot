import { prisma } from '../helpers/database';

export const createReport = async (reporterId: string, reportedId: string) => {
  return await prisma.report.create({
    data: {
      reporterId,
      reportedId,
    },
  });
};
