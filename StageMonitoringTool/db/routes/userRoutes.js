import express from 'express';
import userController from '../userControllers/userController.js';
import stageController from '../objectControllers/stageController.js';
import docentController from '../userControllers/docentController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: "API is working perfectly!" });
});

router.post('/login', userController.loginUser);
router.get('/me', userController.checkLogin);
router.post('/logout', userController.logoutUser);

router.get('/select-user', userController.selectUser);
router.post('/create-user', userController.createUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

router.get('/select-stage', stageController.selectStageRaw);
router.post('/update-stage', stageController.updateStageRaw);
router.get('/select-docent', docentController.selectDocentRaw);

export default router;
