import React from "react";
import { useRecipe } from "../../context/RecipeContext";
import { calculateDough } from "../../utils/utils";
import { calculatePrepSchedule } from "../../utils/scheduleCalculator";
import { formatScheduleTime } from "../../utils/dateUtils";
import { formatGrams } from "../../utils/recipeFormatting";

export default function Step7FinalRecipe({ setCurrentStep }) {
  const { formData, scheduleData, isTimelineConfirmed } = useRecipe();
  const results = calculateDough(formData);
  const schedule = calculatePrepSchedule({ ...scheduleData, bakingDateTime: formData.bakingDateTime });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-yellow-400">
        {formData.bigaPercent}% Biga Pizza Recipe
      </h2>

      <p className="text-center text-gray-600 dark:text-stone-300">
        {formData.numPizzas} Pizzas – {formData.ballWeight}g balls – {formData.finalHydration}% Hydration
      </p>

      {/* Ingredient Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {/* Biga Column */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded shadow border border-gray-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-400 mb-2">Biga Ingredients</h3>
          <ul className="text-sm text-gray-700 dark:text-stone-300 space-y-1">
            <li>Flour: {formatGrams(results.bigaFlour)}</li>
            <li>Water: {formatGrams(results.bigaWater)}</li>
            <li>Yeast ({formData.yeastType}): {formatGrams(results.bigaYeast)}</li>
            <li className="mt-2 font-medium">Total: {formatGrams(results.bigaFlour + results.bigaWater + results.bigaYeast)}</li>
          </ul>
        </div>

        {/* Refresh Column */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded shadow border border-gray-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-400 mb-2">Refresh Ingredients</h3>
          <ul className="text-sm text-gray-700 dark:text-stone-300 space-y-1">
            <li>Flour: {formatGrams(results.finalFlour)}</li>
            <li>Water: {formatGrams(results.finalWater)}</li>
            <li>Yeast ({formData.yeastType}): {formatGrams(results.refreshYeast)}</li>
            <li>Salt: {formatGrams(results.totalSalt)}</li>
            {formData.maltPercent && <li>Malt: {formatGrams(results.totalMalt)}</li>}
            <li className="mt-2 font-medium">Total: {formatGrams(results.finalFlour + results.finalWater + results.refreshYeast + results.totalSalt + results.totalMalt)}</li>
          </ul>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-yellow-400 mb-4">Step-by-Step Instructions</h3>
        <ol className="space-y-6 text-sm text-gray-800 dark:text-stone-300">
          <li>
            <strong>1. Prepare Biga</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.prepBigaTime ? formatScheduleTime(schedule.prepBigaTime) : '• TBD'}
            </p>
            <p>Mix biga ingredients and allow to ferment at cool room temperature. Keep it loosely covered.</p>
          </li>
          <li>
            <strong>2. Autolyze</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.autolyzeRefreshTime ? formatScheduleTime(schedule.autolyzeRefreshTime) : '• TBD'}
            </p>
            <p>Mix flour and water from refresh phase and let rest. This helps gluten develop before kneading.</p>
          </li>
          <li>
            <strong>3. Prepare Final Dough</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.prepDoughTime ? formatScheduleTime(schedule.prepDoughTime) : '• TBD'}
            </p>
            <p>Combine biga with the refresh dough, yeast, salt, and malt. Knead until smooth and elastic.</p>
          </li>
          <li>
            <strong>4. Prepare Balls</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.prepBallsTime ? formatScheduleTime(schedule.prepBallsTime) : '• TBD'}
            </p>
            <p>Turn your dough out onto a clean surface. DIvide and weigh into your preferred ball weight. Form into balls, place into your lightly oiled proofing container/s. Cover and leave to proof, until they are double in size. At this point you can bake, or refrigerate. Remove from fridge at least an hour before baking so they can coem to room temp. </p>
          </li>
          <li>
            <strong>5. Preheat Oven</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.preheatOvenTime ? formatScheduleTime(schedule.preheatOvenTime) : '• TBD'}
            </p>
            <p>Preheat your oven and pizza stone/steel to the maximum temperature available.</p>
          </li>
          <li>
            <strong>6. Prepare Toppings</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {isTimelineConfirmed && schedule.prepToppingsTime ? formatScheduleTime(schedule.prepToppingsTime) : '• TBD'}
            </p>
            <p>Prepare and portion your toppings so they’re ready when the dough is.</p>
          </li>
          <li>
            <strong>7. Bake Pizza</strong>
            <p className="text-sm text-gray-600 dark:text-stone-400 italic">
              {formData.bakingDateTime ? formatScheduleTime(schedule.bakePizza) : '• TBD'}
            </p>
            <p>Stretch your dough, top your pizzas, and bake until golden and blistered. Enjoy!</p>
          </li>
        </ol>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Print Recipe
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Save Recipe
        </button>
        <button className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:border-stone-700 dark:text-yellow-500 dark:hover:bg-stone-700 transition">
          Edit / Back
        </button>
      </div>
    </div>
  );
}
