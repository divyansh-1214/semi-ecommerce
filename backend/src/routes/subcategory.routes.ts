import { Router } from 'express';
import * as subcategoryController from '../controllers/subcategory.controller.js';

const router = Router();

router.get('/:id', subcategoryController.getSubcategory);
router.get('/:id/parts', subcategoryController.getSubcategoryParts);
router.get('/:id/spec-columns', subcategoryController.getSubcategorySpecColumns);

export default router;
