import prisma, { Prisma } from '../config/database.js';

export interface PartFilters {
  category?: string;
  subcategory?: string;
  partNo?: string;
  page?: number;
  limit?: number;
}

export const getParts = async (filters: PartFilters) => {
  const { category, subcategory, partNo, page = 1, limit = 50 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.PartWhereInput = {};

  if (partNo) {
    where.partNo = { contains: partNo, mode: 'insensitive' };
  }
  
  if (category || subcategory) {
    where.SubCategory = {};
    if (subcategory) {
      // If it's a number (id), we can search by id, otherwise by name
      if (!isNaN(Number(subcategory))) {
        where.SubCategory.id = Number(subcategory);
      } else {
        where.SubCategory.name = { contains: subcategory, mode: 'insensitive' };
      }
    }
    if (category) {
      where.SubCategory.Category = {};
      if (!isNaN(Number(category))) {
        where.SubCategory.Category.id = Number(category);
      } else {
        where.SubCategory.Category.name = { contains: category, mode: 'insensitive' };
      }
    }
  }

  const [parts, total] = await Promise.all([
    prisma.part.findMany({
      where,
      include: {
        PartSpec: {
          include: {
            SpecColumn: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { partNo: 'asc' }
    }),
    prisma.part.count({ where })
  ]);

  return { parts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getPartByNo = async (partNo: string) => {
  return prisma.part.findUnique({
    where: { partNo },
    include: {
      PartSpec: {
        include: {
          SpecColumn: true
        }
      }
    }
  });
};
