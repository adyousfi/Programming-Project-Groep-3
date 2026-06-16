import express from 'express';
import docentController from '../userControllers/docentController.js';

const router = express.Router();

router.get('/', docentController.selectDocent);

export default router;
