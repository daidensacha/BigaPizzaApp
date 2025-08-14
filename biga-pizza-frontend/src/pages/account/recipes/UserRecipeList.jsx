import React, { useEffect, useState } from 'react';
import { getUserRecipes, deleteRecipe } from '@services/recipeService';
import { useAuth } from '@context/AuthContext';
import { toast } from 'react-hot-toast';
import RecipeCard from '@components/recipes/RecipeCard';

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

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id, user.token);
      toast.success('Recipe deleted');
      setRecipes((prev) => prev.filter((r) => r._id !== id)); // ✅ update local state
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) return <div className="p-4">Loading recipes...</div>;

  return (
    <div className="px-2 lg:px-4 w-full">
      <h2 className="text-2xl font-bold mb-4 text-stone-800 dark:text-amber-400">
        Your Saved Recipes
      </h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600 dark:text-stone-300">
          No recipes saved yet.
        </p>
      ) : (
        <ul
          className="w-full grid gap-5
                 [grid-template-columns:repeat(auto-fill,minmax(420px,1fr))]
        [justify-items:start]
        [align-items:stretch]
        [place-content:start]"
        >
          {recipes.map((recipe) => (
            <li key={recipe._id} className="min-w-0 w-full">
              <RecipeCard recipe={recipe} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
