import { Router } from 'express';
import multer from 'multer';
import { importCsv } from '../controllers/import.controller.js';

const router = Router();

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only CSV (.csv) is allowed!'));
    }
  }
});

const uploadMiddleware = (req: any, res: any, next: any) => {
  const uploadSingle = upload.single('file');
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message, code: 400 });
    }
    next();
  });
};

router.post('/', uploadMiddleware, importCsv);

export default router;
