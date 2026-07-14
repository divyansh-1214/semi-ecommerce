import type { Request, Response, NextFunction } from 'express';
import * as specColumnService from '../services/specColumn.service.js';

export const getSpecColumns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const columns = await specColumnService.getAllSpecColumns();
    res.json(columns);
  } catch (err) {
    next(err);
  }
};
