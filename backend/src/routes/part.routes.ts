import { Router } from 'express';
import * as partController from '../controllers/part.controller.js';

const router = Router();

router.get('/', partController.getParts);
router.get('/:partNo', partController.getPart);

export default router;
