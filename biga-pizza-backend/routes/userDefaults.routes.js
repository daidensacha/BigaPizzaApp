import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getMyDefaults,
  updateMyDefaults,
  resetMyDefaults, // ← add this
} from '../controllers/userDefaults.controller.js';

const router = express.Router();

router.get('/api/user/defaults', protect, getMyDefaults);
router.put('/api/user/defaults', protect, updateMyDefaults);

// NEW: reset to system defaults (recompute yeast)
router.post('/api/user/defaults/reset', protect, resetMyDefaults);

export default router;
