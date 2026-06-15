import express from 'express';
import bedrijfController from '../objectControllers/bedrijfController.js';

const router = express.Router();

router.post("/assign-bedrijftomentor", bedrijfController.linkBedrijfToStageMentor);
router.post("/create-bedrijf", bedrijfController.createBedrijf);

export default router;
