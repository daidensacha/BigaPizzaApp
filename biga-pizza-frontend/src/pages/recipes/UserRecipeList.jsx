import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export default function RecipeListPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/recipes/user/${user.id}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRecipes();
    }
  }, [user]);

  if (loading)
    return <p className="text-center text-yellow-500">Loading recipes...</p>;

  if (!recipes.length)
    return <p className="text-center text-gray-400">No recipes found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-yellow-100">
        Your Recipes
      </h2>
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li
            key={recipe._id}
            className="bg-white dark:bg-stone-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-lg text-red-600">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/recipes/${recipe._id}`}
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
              <button className="text-yellow-500 hover:underline">Edit</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
