import express from 'express';
import rubriekController from '../objectControllers/rubriekController.js';

const router = express.Router();

router.post("/create-rubriek", rubriekController.createRubriek);

export default router;
