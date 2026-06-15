import express from 'express';
import userController from '../../db/userControllers/userController.js';

const router = express.Router();

// ✅ LOGIN
router.post('/login', userController.loginUser);

// ✅ CHECK login
router.get('/me', userController.checkLogin);

// ✅ LOGOUT
router.post('/logout', userController.logoutUser);

export default router;
