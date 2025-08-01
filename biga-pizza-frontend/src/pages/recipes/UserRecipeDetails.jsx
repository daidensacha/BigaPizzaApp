import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UserRecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return <p className="text-center text-yellow-500">Loading recipe...</p>;
  if (!recipe)
    return <p className="text-center text-gray-400">Recipe not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-4">{recipe.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Created: {new Date(recipe.createdAt).toLocaleString()}
      </p>

      <div className="bg-white dark:bg-stone-800 rounded shadow p-4 space-y-2">
        <p>
          <strong>Biga %:</strong> {recipe.bigaPercent}%
        </p>
        <p>
          <strong>Hydration:</strong> {recipe.hydration}%
        </p>
        <p>
          <strong>Salt %:</strong> {recipe.saltPercent}%
        </p>
        <p>
          <strong>Fermentation:</strong> {recipe.fermentationHours}h
        </p>
        <p>
          <strong>Notes:</strong> {recipe.notes || '—'}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link to="/account" className="text-blue-500 hover:underline">
          ← Back to Recipes
        </Link>
        <button className="text-yellow-500 hover:underline">Edit</button>
        <button className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  );
}
