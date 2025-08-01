import Recipe from '../models/Recipe.js';

const createRecipe = async (req, res) => {
  try {
    console.log('Models: Saving recipe for user:', req.user); // still useful

    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id, // ✅ fix here
    });

    const saved = await newRecipe.save();

    console.log(`✅ Recipe saved - ID: ${saved._id}`);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Recipe Error:', err);
    res.status(500).json({ message: 'Failed to create recipe' });
  }
};

// Get all recipes for a user
const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Get Recipes Error:', err);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

// Get one recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user._id,
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

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error('Delete Recipe Error:', err);
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};

export {
  createRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
