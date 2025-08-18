import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getMe,
  updateProfile,
  changePassword, // if you have it here
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile); // <— ADD THIS
router.post('/change-password', protect, changePassword); // optional

export default router;
