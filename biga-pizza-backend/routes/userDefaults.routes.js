import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getMyDefaults,
  updateMyDefaults,
} from '../controllers/userDefaults.controller.js';

// Ensure your auth middleware sets req.user
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

const router = express.Router();

router.get('/api/user/defaults', protect, getMyDefaults);
router.put('/api/user/defaults', protect, updateMyDefaults);

export default router;
