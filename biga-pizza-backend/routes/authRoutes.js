// routes/authRoutes.js
import express from 'express';
import {
  register,
  loginUser,
  logoutUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/change-password', protect, changePassword);

// forgot/reset
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
