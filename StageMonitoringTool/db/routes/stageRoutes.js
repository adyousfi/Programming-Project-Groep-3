import express from 'express';
import stageController from '../objectControllers/stageController.js';

const router = express.Router();

router.post("/create-stage", stageController.createStage);
router.post("/update-stage", stageController.updateStage);
router.get("/select-stage", stageController.selectStage);

export default router;
