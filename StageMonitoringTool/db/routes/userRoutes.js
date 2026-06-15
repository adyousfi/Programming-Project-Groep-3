import express from 'express';
import userController from '../userControllers/userController.js';

const router = express.Router();

router.post("/create-user", userController.createUser);
router.get("/select-user", userController.selectUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

export default router;
