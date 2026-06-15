import express from 'express';
import logboekController from '../objectControllers/logboekController.js';

const router = express.Router();

router.post("/create-logboek", logboekController.createLogboek);
router.post("/assignopmerking-logboek", logboekController.assignOpmerkingToLogboek);

export default router;
