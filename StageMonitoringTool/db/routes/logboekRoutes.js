import express from 'express';
import logboekController from '../objectControllers/logboekController.js';

const router = express.Router();

router.get("/entry/:logboek_id", logboekController.getLogboekById);
router.get("/stage/:stageId", logboekController.getLogboekByStage);
router.post("/", logboekController.upsertLogboek);
router.post("/submit-week", logboekController.submitWeek);
router.post("/create-logboek", logboekController.createLogboek);
router.post("/assignopmerking-logboek", logboekController.assignOpmerkingToLogboek);

export default router;
