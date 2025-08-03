import Recipe from '../models/Recipe.js';
import asyncHandler from 'express-async-handler';

const createRecipe = asyncHandler(async (req, res) => {
  const { title, formData, scheduleData, calculatedData } = req.body;
  console.log('📥 Received new recipe:', req.body);
  const recipe = new Recipe({
    user: req.user.id,
    title,
    formData,
    scheduleData,
    calculatedData,
  });
  const savedRecipe = await recipe.save();
  console.log('✅ Recipe saved:', savedRecipe);
  res.status(201).json(savedRecipe);
});

// Get all recipes for a user
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

// Get one recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    console.error('Get Recipe Error:', err);
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Recipe Error:', err);
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

// PATCH /api/recipes/:id/notes
const updateRecipeNotes = asyncHandler(async (req, res) => {
  const { notes, rating } = req.body;

  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  recipe.notes = notes;
  recipe.rating = rating;

  const updatedRecipe = await recipe.save();
  res.status(200).json(updatedRecipe);
});

// Delete a recipe
// DELETE /api/recipes/:id
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await recipe.deleteOne();
  res.status(200).json({ message: 'Recipe deleted' });
});

export {
  createRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  updateRecipeNotes,
  deleteRecipe,
};
