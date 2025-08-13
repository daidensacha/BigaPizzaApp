import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthModal } from '@/context/AuthModalContext';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRecipe } from '@/context/RecipeContext';
import { calculateDough } from '@/utils/utils';
import { calculatePrepSchedule } from '@/utils/scheduleCalculator';
import { formatLocalLabel } from '@/utils/dayjsConfig';
import { formatGrams } from '@/utils/recipeFormatting';
import { useAuth } from '@context/AuthContext';
import { saveRecipe } from '@services/recipeService';
import { generateRecipeTitle } from '@/utils/recipeFormatting';
import { round } from '@utils/utils';

export default function Step7FinalRecipe({ setCurrentStep, onBack }) {
  const { user } = useAuth();
  const { formData, scheduleData, isTimelineConfirmed } = useRecipe();
  const results = calculateDough(formData);
  const schedule = calculatePrepSchedule(scheduleData);

  // const nav = useNavigate();
  // const location = useLocation();
  const { openAuthModal } = useAuthModal();

  const calculatedData = {
    ingredients: {
      biga: {
        flour: Math.round(results.bigaFlour),
        water: Math.round(results.bigaWater),
        yeast: round(results.bigaYeast, 2), // 2 decimal places
        total: Math.round(
          results.bigaFlour + results.bigaWater + results.bigaYeast
        ),
      },
      refresh: {
        flour: Math.round(results.finalFlour),
        water: Math.round(results.finalWater),
        yeast: round(results.refreshYeast, 2), // 2 decimal places
        salt: round(results.totalSalt, 1), // 1 decimal
        malt: round(results.totalMalt, 2), // 2 decimal places
        total: Math.round(
          results.finalFlour +
            results.finalWater +
            results.refreshYeast +
            results.totalSalt +
            results.totalMalt
        ),
      },
    },

    timelineSteps: [
      {
        label: 'Prepare Biga',
        time: isTimelineConfirmed ? schedule.prepBigaTime : null,
        description:
          'Mix biga ingredients and allow to ferment at cool room temperature. Keep it loosely covered.',
      },
      {
        label: 'Autolyze',
        time: isTimelineConfirmed ? schedule.autolyzeRefreshTime : null,
        description:
          'Mix flour and water from refresh phase and let rest. This helps gluten develop before kneading.',
      },
      {
        label: 'Prepare Final Dough',
        time: isTimelineConfirmed ? schedule.prepDoughTime : null,
        description:
          'Combine biga with the refresh dough, yeast, salt, and malt. Knead until smooth and elastic.',
      },
      {
        label: 'Prepare Balls',
        time: isTimelineConfirmed ? schedule.prepBallsTime : null,
        description:
          'Divide dough into balls, place into your lightly oiled proofing container. Proof until double in size or refrigerate.',
      },
      {
        label: 'Preheat Oven',
        time: isTimelineConfirmed ? schedule.preheatOvenTime : null,
        description:
          'Preheat your oven and pizza stone/steel to the maximum temperature available.',
      },
      {
        label: 'Prepare Toppings',
        time: isTimelineConfirmed ? schedule.prepToppingsTime : null,
        description:
          'Prepare and portion your toppings so they’re ready when the dough is.',
      },
      {
        label: 'Bake Pizza',
        time: scheduleData.bakingDateTime
          ? formatLocalLabel(schedule.bakingDateTime) // now a dayjs object
          : null,
        description:
          'Stretch your dough, top your pizzas, and bake until golden and blistered. Enjoy!',
      },
    ],
  };

  const handleSaveRecipe = async () => {
    if (!user?.token) {
      toast.error('You must be logged in to save your recipe.');
      return;
    }

    const recipePayload = {
      title: generateRecipeTitle(formData, scheduleData),
      formData,
      scheduleData,
      calculatedData,
    };

    try {
      console.log('📦 Saving this payload:', recipePayload);
      await saveRecipe(recipePayload, user.token);
      toast.success('Recipe saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save recipe.');
    }
  };

  return (
    <div className="print-wrapper space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-amber-600">
        {formData.bigaPercent}% Biga Pizza Recipe
      </h2>

      <p className="text-center text-gray-600 dark:text-stone-300">
        {formData.numPizzas} Pizzas – {formData.ballWeight}g balls –{' '}
        {formData.finalHydration}% Hydration
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 bg-opacity-40 dark:bg-opacity-40 p-4 rounded-lg shadow border border-gray-200 dark:border-stone-700">
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

        <div className="bg-white dark:bg-stone-900 bg-opacity-40 dark:bg-opacity-40 p-4 rounded-lg shadow border border-gray-200 dark:border-stone-700">
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-amber-600 mb-4">
          Step-by-Step Instructions
        </h3>
        <ol className="space-y-6 text-sm text-gray-800 dark:text-stone-300 text-left text-justify">
          {calculatedData.timelineSteps.map((step, index) => (
            <li key={index}>
              <strong>
                {index + 1}. {step.label}
              </strong>
              <p className="text-sm text-gray-600 dark:text-stone-400 italic">
                {step.time ? formatLocalLabel(step.time) : '• TBD'}
              </p>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="no-print bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Print Recipe
        </button>
        {user ? (
          <button
            onClick={handleSaveRecipe}
            className="no-print bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Save Recipe
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')} // or 'register', or no arg if your modal handles both
            className="no-print border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:border-stone-700 dark:text-yellow-500 dark:hover:bg-stone-700 transition"
          >
            Log in / Register to save & edit
          </button>
        )}
        <button
          onClick={onBack}
          className="no-print border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:border-stone-700 dark:text-yellow-500 dark:hover:bg-stone-700 transition"
        >
          Edit / Back
        </button>
      </div>
    </div>
  );
}
