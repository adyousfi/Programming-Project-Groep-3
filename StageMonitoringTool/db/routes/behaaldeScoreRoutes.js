import express from 'express';
import behaaldeScoreController from '../objectControllers/behaaldeScoreController.js';

const router = express.Router();

router.post("/create-behaaldescore", behaaldeScoreController.createBehaaldeScore);

export default router;