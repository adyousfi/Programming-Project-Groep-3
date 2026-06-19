import express from 'express';
import competentieController from '../objectControllers/competentieController.js';

const router = express.Router();

router.get('/all', competentieController.getAllCompetenties);
router.get('/all-met-rubrieken', competentieController.getAllCompetentiesMetRubrieken);
router.post("/create-competentie", competentieController.createCompetentie);
router.post("/create-competentie-met-rubrieken", competentieController.createCompetentieMetRubrieken);
router.put('/update-competentie/:competentie_id', competentieController.updateCompetentie);
router.delete('/delete-competentie/:competentie_id', competentieController.deleteCompetentie);

export default router;

