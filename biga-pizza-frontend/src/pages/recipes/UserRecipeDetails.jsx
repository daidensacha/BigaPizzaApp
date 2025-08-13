import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRecipeById } from '@/services/recipeService';
import { formatGrams } from '@/utils/recipeFormatting';
import { formatLocalLabel } from '@/utils/dayjsConfig';
import { useAuth } from '@context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function UserRecipeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      getRecipeById(id, user.token)
        .then(setRecipe)
        .catch((err) => {
          console.error('❌ Error fetching recipe:', err);
          setError('Failed to load recipe');
        })
        .finally(() => setLoading(false)); // ✅ ensure this runs
    }
  }, [id, user]);

  const handleBack = () => navigate('/my-recipes');
  // console.log('👤 User in UserRecipeDetails:', user);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error || !recipe)
    return <p className="p-4 text-red-500">{error || 'Recipe not found.'}</p>;

  const { formData, scheduleData, calculatedData, notes, rating } = recipe;
  console.log('GET recipeById calculatiedData', calculatedData);
  console.log('GET recipeById scheduleData:', scheduleData);
  return (
    <div className="print-wrapper space-y-6 p-6 max-w-4xl mx-auto">
      <div className="no-print flex items-center mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-sm dark:text-yellow-400 dark:hover:text-yellow-300 text-yellow-600 hover:text-yellow-500 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Recipes
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-amber-600">
        {formData.bigaPercent}% Biga Pizza Recipe
      </h2>

      <p className="text-center text-gray-600 dark:text-stone-300">
        {formData.numPizzas} Pizzas – {formData.ballWeight}g balls –{' '}
        {formData.finalHydration}% Hydration
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biga */}
        <div className="bg-white dark:bg-stone-900 bg-opacity-40 p-4 rounded-lg shadow border border-gray-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-amber-600 mb-2">
            Biga Ingredients
          </h3>
          <ul className="text-sm text-gray-700 dark:text-stone-300 space-y-1">
            <li>Flour: {formatGrams(calculatedData.ingredients.biga.flour)}</li>
            <li>Water: {formatGrams(calculatedData.ingredients.biga.water)}</li>
            <li>
              Yeast ({formData.yeastType}):{' '}
              {formatGrams(calculatedData.ingredients.biga.yeast, 'yeast')}
            </li>
            <li className="mt-2 font-medium">
              Total: {formatGrams(calculatedData.ingredients.biga.total)}
            </li>
          </ul>
        </div>

        {/* Refresh */}
        <div className="bg-white dark:bg-stone-900 bg-opacity-40 p-4 rounded-lg shadow border border-gray-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-amber-600 mb-2">
            Refresh Ingredients
          </h3>
          <ul className="text-sm text-gray-700 dark:text-stone-300 space-y-1">
            <li>
              Flour: {formatGrams(calculatedData.ingredients.refresh.flour)}
            </li>
            <li>
              Water: {formatGrams(calculatedData.ingredients.refresh.water)}
            </li>
            <li>
              Yeast ({formData.yeastType}):{' '}
              {formatGrams(calculatedData.ingredients.refresh.yeast, 'yeast')}
            </li>
            <li>
              Salt: {formatGrams(calculatedData.ingredients.refresh.salt)}
            </li>
            {formData.maltPercent && (
              <li>
                Malt:{' '}
                {formatGrams(calculatedData.ingredients.refresh.malt, 'malt')}
              </li>
            )}
            <li className="mt-2 font-medium">
              Total: {formatGrams(calculatedData.ingredients.refresh.total)}
            </li>
          </ul>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-amber-600 mb-4">
          Step-by-Step Instructions
        </h3>
        <ol className="space-y-6 text-sm text-gray-800 dark:text-stone-300 text-left text-justify">
          {calculatedData.timelineSteps.map((step, index) => {
            // console.log(`Rendering step: ${step.label}, time: ${step.time}`);
            return (
              <li key={index}>
                <strong>
                  {index + 1}. {step.label}
                </strong>
                <p className="text-sm text-gray-600 dark:text-stone-400 italic">
                  {step.time ? formatLocalLabel(step.time) : '• TBD'}
                </p>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Notes and Rating */}
      {(notes || rating) && (
        <div className="mt-6 text-sm text-gray-700 dark:text-stone-300">
          {rating && <p>⭐ Rating: {rating} / 5</p>}
          {notes && <p className="italic mt-1">Notes: {notes}</p>}
        </div>
      )}

      <div className="no-print mt-8 flex justify-center">
        <button
          onClick={() => window.print()}
          className="no-print bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Print Recipe
        </button>
        <Link to={`/account/recipes/${recipe._id}/edit`}>
          <button className="px-4 py-2 mx-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white">
            Edit Recipe
          </button>
        </Link>
        <Link
          to="/account"
          className="bg-gray-600 dark:bg-stone-700 px-4 py-2 rounded hover:bg-gray-500 dark:hover:bg-stone-600"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
