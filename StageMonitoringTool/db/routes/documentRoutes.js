import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import documentController from '../objectControllers/documentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Bestandstype niet toegestaan. Alleen PDF, DOC, DOCX, JPEG en PNG zijn toegestaan.'));
    }
  },
});

const router = express.Router();

router.post('/admin-upload', upload.single('document'), documentController.adminUploadDocument);
router.post('/student-upload', upload.single('document'), documentController.studentUploadDocument);
router.get('/mijn', documentController.getMyDocuments);
router.get('/stage/:stageId', documentController.getStageDocuments);
router.get('/:id/download', documentController.downloadDocument);

export default router;
