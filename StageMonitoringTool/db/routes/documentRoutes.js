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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

// ── Existing routes ──────────────────────────────────────────────────────────

// ✅ Admin upload document (student flow)
router.post('/admin-upload', upload.single('document'), documentController.adminUploadDocument);

// ✅ Student upload document
router.post('/student-upload', upload.single('document'), documentController.studentUploadDocument);

// ✅ GET documenten voor ingelogde student
router.get('/mijn', documentController.getMyDocuments);

// ✅ GET documenten voor een stage (admin)
router.get('/stage/:stageId', documentController.getStageDocuments);

// ✅ Download document
router.get('/:id/download', documentController.downloadDocument);

// ── Bedrijf contract signing routes ─────────────────────────────────────────

// ✅ Admin sends contract PDF to bedrijf HR for signing
router.post('/send-contract', upload.single('document'), documentController.sendContractToBedrijf);

// ✅ Bedrijf HR opens the signing page (no auth — token-based)
router.get('/sign/:token', documentController.getSigningPage);

// ✅ Bedrijf HR submits signature
router.post('/sign/:token', documentController.submitSignature);

// ✅ Admin dashboard polls contract status for a stage
router.get('/contract-status/:stageId', documentController.getContractStatus);

export default router;
