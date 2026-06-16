import express from 'express';
import competentieController from '../objectControllers/competentieController.js';

const router = express.Router();

router.get('/all', competentieController.getAllCompetenties);
router.post("/create-competentie", competentieController.createCompetentie);
router.put('/update-competentie/:competentie_id', competentieController.updateCompetentie);

export default router;
