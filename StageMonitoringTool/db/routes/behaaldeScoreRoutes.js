import express from 'express';
import behaaldeScoreController from '../objectControllers/behaaldeScoreController.js';

const router = express.Router();

router.post("/createbehaaldescore", behaaldeScoreController.createBehaaldescore);

export default router;
