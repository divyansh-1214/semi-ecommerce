import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import subcategoryRoutes from './subcategory.routes.js';
import partRoutes from './part.routes.js';
import specColumnRoutes from './specColumn.routes.js';
import importRoutes from './import.routes.js';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/parts', partRoutes);
router.use('/spec-columns', specColumnRoutes);
router.use('/import', importRoutes);

export default router;
