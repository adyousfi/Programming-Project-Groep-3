import express from 'express';
import evaluatieController from '../objectControllers/evaluatieController.js';

const router = express.Router();

// Voeg hier je endpoints toe, bijvoorbeeld:
router.post("/create-evaluatie", evaluatieController.createEvaluatie);

export default router;