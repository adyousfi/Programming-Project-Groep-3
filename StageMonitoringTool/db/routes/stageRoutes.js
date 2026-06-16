import express from 'express';
import stageController from '../objectControllers/stageController.js';
import adminController from '../userControllers/adminController.js';
import Stage from '../objectModel/stage.js';

const router = express.Router();

router.get('/', stageController.selectStage);
router.post('/', stageController.createStage);
router.get('/goedgekeurd', stageController.getApprovedStages);
router.get('/:id', stageController.selectStageById);
router.get('/student/:studentId', stageController.selectStageByStudentId);
router.put('/:id', stageController.updateStage);

router.put('/:id/docent', async (req, res, next) => {
  try {
    const { docent_id } = req.body;
    const stage = await Stage.findByPk(req.params.id);
    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });
    await stage.update({ docent_id });
    return res.json({ msg: 'Docent gekoppeld' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij koppelen docent' });
  }
});

router.put('/:id/validate-document', adminController.validateStudentDocument);

export default router;
