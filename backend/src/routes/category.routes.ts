import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:categoryId/subcategories', categoryController.getCategorySubcategories);

export default router;
