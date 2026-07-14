import type { Request, Response, NextFunction } from 'express';
import * as partService from '../services/part.service.js';
import { mapPartToResponse, mapPartsToResponse } from '../services/response.mapper.js';

export const getParts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      category: req.query.category as string,
      subcategory: req.query.subcategory as string,
      partNo: req.query.partNo as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50
    };

    const result = await partService.getParts(filters);
    const mappedParts = mapPartsToResponse(result.parts);

    res.json({
      data: mappedParts,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partNo = req.params.partNo;
    const part = await partService.getPartByNo(partNo);

    if (!part) {
      return res.status(404).json({ error: "Part not found", code: 404 });
    }

    res.json(mapPartToResponse(part));
  } catch (err) {
    next(err);
  }
};
