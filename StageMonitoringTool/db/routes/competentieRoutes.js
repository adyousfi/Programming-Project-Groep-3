import express from 'express';
import competentieController from '../objectControllers/competentieController.js';

const router = express.Router();

router.post("/create-competentie", competentieController.createCompetentie);

export default router;