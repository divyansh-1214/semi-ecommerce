import prisma from '../config/database.js';

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { Part: true } // SubCategory handles parts, wait. We need subCategoryCount.
      }
    }
  });

  // Re-map to match the api shape: { id, name, subCategoryCount }
  const counts = await prisma.subCategory.groupBy({
    by: ['categoryId'],
    _count: {
      id: true
    }
  });

  return categories.map(cat => {
    const subCount = counts.find(c => c.categoryId === cat.id)?._count.id || 0;
    return {
      id: cat.id,
      name: cat.name,
      subCategoryCount: subCount
    };
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      SubCategory: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const getSubcategoriesByCategoryId = async (categoryId: number) => {
  return prisma.subCategory.findMany({
    where: { categoryId }
  });
};
