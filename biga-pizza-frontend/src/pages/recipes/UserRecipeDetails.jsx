import { API_BASE } from '@/config/apiConfig';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById } from '@services/recipeService';
import { useAuth } from '@/context/AuthContext';

export default function UserRecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id, user?.token);
        console.log(recipe);
        setRecipe(data);
      } catch (err) {
        console.error('Failed to load recipe', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && id) fetchRecipe();
  }, [id, user]);

  if (loading) return <div className="p-4">Loading recipe...</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Created: {new Date(recipe.createdAt).toLocaleString()}
      </p>
      <div className="space-y-2">
        <p>
          <strong>Dough Balls:</strong> {recipe.formData.numPizzas}
        </p>
        <p>
          <strong>Ball Weight (g):</strong> {recipe.formData.ballWeight}g
        </p>
        <p>
          <strong>Hydration:</strong> {recipe.formData.doughHydration}%
        </p>
        <p>
          <strong>Biga %:</strong> {recipe.formData.bigaPercent}%
        </p>
        <p>
          <strong>Salt %:</strong> {recipe.formData.saltPercent}%
        </p>
        <p>
          <strong>Malt %:</strong> {recipe.formData.maltPercent ?? '0'}%
        </p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
