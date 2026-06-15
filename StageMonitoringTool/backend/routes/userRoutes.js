import express from 'express';
import userController from '../../db/userControllers/userController.js';

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

export default router;
