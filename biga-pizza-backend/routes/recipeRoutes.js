import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createRecipe,
  getRecipeById,
  // (add others later)
} from '../controllers/recipeController.js';

const router = express.Router();

// Other routes

router.post('/', protect, createRecipe); // protect makes req.user available

// ⬇️ Add this new route
router.get('/:id', getRecipeById);

export default router;
