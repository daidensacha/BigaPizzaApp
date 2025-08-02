import React, { useEffect, useState } from 'react';
import { getUserRecipes } from '@services/recipeService';
import { useAuth } from '@context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserRecipeList() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      getUserRecipes(user.token)
        .then(setRecipes)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="p-4">Loading recipes...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Saved Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li
              key={recipe._id}
              className="bg-white dark:bg-stone-700 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-opacity-50 dark:bg-opacity-50"
            >
              <h3 className="text-lg text-stone-600 dark:text-yellow-500 font-semibold">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-stone-300">
                Created on: {new Date(recipe.createdAt).toLocaleString()}
              </p>
              <Link
                to={`/recipes/${recipe._id}`}
                className="text-blue-600 dark:text-blue-400 underline mt-2 inline-block"
              >
                View Recipe
              </Link>
              {/* NOTES: 1. Add two colum display,
                            a. Titlle, date, uer notes and rating on left,
                            b. Placeholder image on right. User can add image of pizza from the baking.
                         2. Include a note field for user to add a note, or notes.
                         3. Include rating, where user can rate the dough result for the recipe */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
