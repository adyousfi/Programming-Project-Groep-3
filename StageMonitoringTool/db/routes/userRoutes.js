import express from 'express';
import userController from '../userControllers/userController.js';
import stageController from '../objectControllers/stageController.js';
import docentController from '../userControllers/docentController.js';

const router = express.Router();

// (Optional) Test root route
router.get('/', (req, res) => {
  res.json({ status: "API is working perfectly!" });
});

// ✅ LOGIN & AUTH
router.post('/login', userController.loginUser);
router.get('/me', userController.checkLogin);
router.post('/logout', userController.logoutUser);

// ✅ USERS (Admin CRUD)
router.get('/select-user', userController.selectUser);
router.post('/create-user', userController.createUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

// ✅ RAW DATA ROUTES (used by koppeldocent page)
router.get('/select-stage', stageController.selectStageRaw);
router.post('/update-stage', stageController.updateStageRaw);
router.get('/select-docent', docentController.selectDocentRaw);

export default router;