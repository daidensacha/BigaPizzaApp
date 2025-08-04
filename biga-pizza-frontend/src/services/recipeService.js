import axios from 'axios';
import { API_BASE } from '@config';

// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

export const getRecipeById = async (id) => {
  const res = await axios.get(`${API_BASE}/api/recipes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateRecipe = async (id, updatedData) => {
  const response = await axios.put(
    `${API_BASE}/api/recipes/${id}`,
    updatedData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// services/recipeService.js
export const updateRecipeNotes = async (id, data, token) => {
  const res = await axios.patch(`${API_BASE}/api/recipes/${id}/notes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteRecipe = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/api/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
