import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const saveRecipe = async (recipeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_BASE}/api/recipes`,
    recipeData,
    config
  );
  return response.data;
};

export const getUserRecipes = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.get(`${API_BASE}/api/recipes/user`, config);
  return res.data;
};

export const getRecipeById = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.get(`${API_BASE}/api/recipes/${id}`, config);
  return res.data;
};
