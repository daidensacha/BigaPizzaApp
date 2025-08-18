// src/routes/recipeRoutes.js
import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

import protect from '../middleware/authMiddleware.js';
import {
  createRecipe,
  getRecipeById,
  getUserRecipes,
  updateRecipe,
  updateRecipeNotes,
  uploadRecipeImage,
  updateRecipeImage,
  updateRecipeTitle,
  deleteRecipe,
} from '../controllers/recipeController.js';

const router = express.Router();

// 🔒 helper: block non-ObjectId strings on :id routes
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid recipe id' });
  }
  next();
};

// Create new recipe
router.post('/', protect, createRecipe);

// 🆕 Current user's recipes (place BEFORE any `/:id`)
router.get('/mine', protect, getUserRecipes);

// (optional) keep old path for now to avoid breaking calls
router.get('/user', protect, getUserRecipes);

// Single recipe by id
router.get('/:id', protect, validateObjectId, getRecipeById);

// Notes
router.patch('/:id/notes', protect, validateObjectId, updateRecipeNotes);

// Update full recipe
router.put('/:id', protect, validateObjectId, updateRecipe);

// Update image (metadata)
router.put('/:id/image', protect, validateObjectId, updateRecipeImage);

// Upload image file
router.post(
  '/:id/upload-image',
  protect,
  validateObjectId,
  upload.single('image'),
  uploadRecipeImage
);

// Delete
router.delete('/:id', protect, validateObjectId, deleteRecipe);

export default router;
