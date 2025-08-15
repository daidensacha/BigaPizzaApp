import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  register,
  loginUser,
  logoutUser,
  changePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/change-password', protect, changePassword);

export default router;
