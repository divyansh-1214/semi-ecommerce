import prisma from '../config/database.js';

export const getSubcategoryById = async (id: number) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id },
    include: {
      Part: {
        select: { partNo: true }
      }
    }
  });

  if (!subCategory) return null;

  return {
    id: subCategory.id,
    name: subCategory.name,
    categoryId: subCategory.categoryId,
    parts: subCategory.Part
  };
};

export const getPartsBySubcategoryId = async (subcategoryId: number, page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;

  const [parts, total] = await Promise.all([
    prisma.part.findMany({
      where: { subCategoryId: subcategoryId },
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
    prisma.part.count({ where: { subCategoryId: subcategoryId } })
  ]);

  return { parts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getActiveSpecColumnsBySubcategoryId = async (subcategoryId: number) => {
  // Find all distinct spec columns that have at least one associated PartSpec in this subcategory
  const activeColumns = await prisma.specColumn.findMany({
    where: {
      PartSpec: {
        some: {
          associated: true,
          Part: {
            subCategoryId: subcategoryId
          }
        }
      }
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      id: 'asc'
    }
  });

  return activeColumns;
};
