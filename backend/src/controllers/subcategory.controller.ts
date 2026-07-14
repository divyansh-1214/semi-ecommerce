import type { Request, Response, NextFunction } from 'express';
import * as subcategoryService from '../services/subCategory.service.js';
import { mapPartsToResponse } from '../services/response.mapper.js';

export const getSubcategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID", code: 400 });
    }

    const subcategory = await subcategoryService.getSubcategoryById(id);
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found", code: 404 });
    }

    res.json(subcategory);
  } catch (err) {
    next(err);
  }
};

export const getSubcategoryParts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID", code: 400 });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await subcategoryService.getPartsBySubcategoryId(id, page, limit);

    // Map parts
    const mappedParts = mapPartsToResponse(result.parts);

    res.json({
      data: mappedParts,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSubcategorySpecColumns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID", code: 400 });
    }

    const columns = await subcategoryService.getActiveSpecColumnsBySubcategoryId(id);
    res.json(columns);
  } catch (err) {
    next(err);
  }
};
