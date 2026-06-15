import express from 'express';
import opmerkingLogboekController from '../objectControllers/opmerkingLogboekController.js';

const router = express.Router();

router.post("/create-opmerkinglogboek", opmerkingLogboekController.createOpmerkinglogboek);

export default router;
