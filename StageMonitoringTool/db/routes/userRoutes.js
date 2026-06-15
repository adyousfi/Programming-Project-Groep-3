import express from 'express';
import userController from '../../db/userControllers/userController.js';
import stageController from '../../db/objectControllers/stageController.js';
import docentController from '../../db/userControllers/docentController.js';

const router = express.Router();

// ✅ LOGIN
router.post('/login', userController.loginUser);

// ✅ CHECK login
router.get('/me', userController.checkLogin);

// ✅ LOGOUT
router.post('/logout', userController.logoutUser);

// ✅ USERS (Admin CRUD)
router.get('/select-user', userController.selectUser);
router.post('/create-user', userController.createUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

// ✅ Raw data routes (used by koppeldocent page)
router.get('/select-stage', stageController.selectStageRaw);
router.post('/update-stage', stageController.updateStageRaw);
router.get('/select-docent', docentController.selectDocentRaw);

export default router;
