import express from 'express';
import stageController from '../../db/objectControllers/stageController.js';
import docentController from '../../db/userControllers/docentController.js';
import adminController from '../../db/userControllers/adminController.js';
import Stage from '../../db/objectModel/stage.js';

const router = express.Router();

// ✅ GET alle stages
router.get('/', stageController.selectStage);

// ✅ POST nieuwe stage aanmaken
router.post('/', stageController.createStage);

// ✅ GET goedgekeurde stages
router.get('/goedgekeurd', stageController.getApprovedStages);

// ✅ GET stage by ID
router.get('/:id', stageController.selectStageById);

// ✅ GET stage by student_id
router.get('/student/:studentId', stageController.selectStageByStudentId);

// ✅ PUT update stage
router.put('/:id', stageController.updateStage);

// ✅ PUT docent koppelen aan stage
router.put('/:id/docent', async (req, res, next) => {
  // We can handle this logic directly here or move it to a specific method in stageController if prefered
  // server.js had this inline. Let's keep it clean here or call a controller.
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

// ✅ Admin validate student document
router.put('/:id/validate-document', adminController.validateStudentDocument);

export default router;
