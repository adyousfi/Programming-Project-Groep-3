import express from 'express';
import rubriekController from '../objectControllers/rubriekController.js';

const router = express.Router();

router.get('/by-competentie/:competentie_id', rubriekController.getRubriekenByCompetentie);
router.post("/create-rubriek", rubriekController.createRubriek);
router.put('/update-rubriek/:rubriek_id', rubriekController.updateRubriek);

export default router;
