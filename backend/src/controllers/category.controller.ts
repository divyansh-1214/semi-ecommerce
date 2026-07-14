import type { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID", code: 400 });
    }
    
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found", code: 404 });
    }

    // Remap response shape
    res.json({
      id: category.id,
      name: category.name,
      subCategories: category.SubCategory
    });
  } catch (err) {
    next(err);
  }
};

export const getCategorySubcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.categoryId as string);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID", code: 400 });
    }

    const subCategories = await categoryService.getSubcategoriesByCategoryId(categoryId);
    res.json(subCategories);
  } catch (err) {
    next(err);
  }
};
