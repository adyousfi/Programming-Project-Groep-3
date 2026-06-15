import express from 'express';
import docentController from '../../db/userControllers/docentController.js';

const router = express.Router();

// ✅ GET alle docenten
router.get('/', docentController.selectDocent);

export default router;
