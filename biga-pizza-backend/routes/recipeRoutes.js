import express from 'express';
import {
  createRecipe,
  getRecipeById,
  getUserRecipes,
  updateRecipeNotes,
  deleteRecipe,
  // Add more routes like update/delete later
} from '../controllers/recipeController.js';

import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new recipe (only for authenticated users)
router.post('/', protect, createRecipe);

// Get all user recipes to diplay list in user dashboard
router.get('/user', protect, getUserRecipes);

// Get single recipe by ID (public or protected depending on your logic)
router.get('/:id', protect, getRecipeById);

// PATCH /api/recipes/:id/notes
router.patch('/:id/notes', protect, updateRecipeNotes);

// DELETE Recipe by id
router.delete('/:id', protect, deleteRecipe);

export default router;
