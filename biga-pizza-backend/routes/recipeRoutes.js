import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // Temp local storage

import {
  createRecipe,
  getRecipeById,
  getUserRecipes,
  updateRecipe,
  updateRecipeNotes,
  uploadRecipeImage,
  updateRecipeImage,
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

// PUT /api/recipes/:id (updates recipe)
router.put('/:id', protect, updateRecipe);

router.put('/:id/image', protect, updateRecipeImage);

// Upload image to recipe list view
router.post(
  '/:id/upload-image',
  protect,
  upload.single('image'),
  uploadRecipeImage
);

// DELETE Recipe by id
router.delete('/:id', protect, deleteRecipe);

export default router;
