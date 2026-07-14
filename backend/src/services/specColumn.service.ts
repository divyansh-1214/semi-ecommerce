import prisma from '../config/database.js';

export const getAllSpecColumns = async () => {
  return prisma.specColumn.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};
