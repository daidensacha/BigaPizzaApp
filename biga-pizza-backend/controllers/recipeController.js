import Recipe from '../models/Recipe.js';
import asyncHandler from 'express-async-handler';
import { calculatePrepSchedule } from '../utils/scheduleCalculator.js';
import dayjs from 'dayjs';
import camelCase from 'lodash.camelcase';

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
// controllers/recipeController.js

const updateRecipe = async (req, res) => {
  // console.log('req.body.scheduleData: ', req.body.scheduleData);
  // console.log(
  //   'req.body.formData.bakingDateTime: ',
  //   req.body.formData.bakingDateTime
  // );
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Set basic data
    recipe.formData = req.body.formData;
    recipe.hasSchedule = req.body.hasSchedule;

    if (req.body.hasSchedule === false) {
      recipe.scheduleData = null;

      // Strip time values from calculatedData.timelineSteps
      if (recipe.calculatedData?.timelineSteps) {
        recipe.calculatedData.timelineSteps =
          recipe.calculatedData.timelineSteps.map(({ label, description }) => ({
            label,
            description,
          }));
      }
    } else if (req.body.scheduleData) {
      recipe.scheduleData = req.body.scheduleData;

      // ✅ Recalculate timelineSteps with actual times
      const schedule = calculatePrepSchedule({
        ...req.body.scheduleData,
        bakingDateTime: req.body.formData?.bakingDateTime,
      });

      // console.log('🧮 Calculated schedule:', schedule);

      recipe.calculatedData.timelineSteps = schedule;
    }

    // console.log('💾 Saving recipe with ID:', req.params.id);
    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    console.error('🔥 Update recipe error:', err);
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

const uploadRecipeImage = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.image = `/uploads/${req.file.filename}`;
    await recipe.save();

    res.json({ message: 'Image uploaded', image: recipe.image });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

// In recipeController.js
const updateRecipeImage = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { image } = req.body;
    if (!image)
      return res.status(400).json({ message: 'Image URL is required' });

    recipe.image = image;
    await recipe.save();

    res.json({ message: 'Image updated', image: recipe.image });
  } catch (err) {
    console.error('🔥 Failed to update recipe image:', err);
    res.status(500).json({ message: 'Failed to update image' });
  }
};

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
  uploadRecipeImage,
  updateRecipeImage,
  deleteRecipe,
};
