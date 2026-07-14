import { Router } from 'express';
import * as specColumnController from '../controllers/specColumn.controller.js';

const router = Router();

router.get('/', specColumnController.getSpecColumns);

export default router;
