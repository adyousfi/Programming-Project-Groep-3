import express from 'express';
import evaluatieController from '../objectControllers/evaluatieController.js';

const router = express.Router();

router.post("/create-evaluatie", evaluatieController.createEvaluatie);

// Frontend: check of evaluaties bestaan + toon bestaande per competentie
router.get('/status', evaluatieController.getEvaluatieStatus);

// Frontend: check of door docent aangemaakte tussentijdse evaluatie bestaat
router.get('/tussentijds-status', evaluatieController.getTussentijdsStatus);

// Frontend: maak evaluatie-instanties per competentie
router.post('/create-per-competentie', evaluatieController.createEvaluatiesPerCompetentie);

// Frontend: update score + feedback per competentie
router.put('/:stageId/per-competentie', evaluatieController.updateEvaluatiesPerCompetentie);


// debug helper
router.get('/_ping', (req, res) => res.json({ ok: true }));

export default router;


