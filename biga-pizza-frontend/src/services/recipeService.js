import axios from 'axios';
import { API_BASE } from '@config';

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

// This update recipe worked
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

export const updateRecipeImage = async (id, imageUrl, token) => {
  const response = await fetch(`${API_BASE}/api/recipes/${id}/image`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: imageUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to update image');
  }

  return response.json();
};

export const uploadRecipeImage = async (id, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${API_URL}/recipes/${id}/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Image upload failed');
  return res.json();
};

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
