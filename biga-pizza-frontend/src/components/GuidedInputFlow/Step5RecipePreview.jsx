import React from 'react';
import { toast } from 'react-hot-toast';
import { calculateDough, YEAST_CORRECTION_DEFAULTS } from '@/utils/utils';
import { useRecipe } from '@/context/RecipeContext';
import { generatePreviewRows } from '@/utils/previewHelpers';

export default function Step5RecipePreview({
  onCreateSchedule,
  onSkip,
  isEditing = false,
}) {
  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleCorrectionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [`${name}Correction`]: parseFloat(value),
    }));
  };

  const handleReset = () => {
    setFormData((prev) => ({
      ...prev,
      shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
      longCorrection: YEAST_CORRECTION_DEFAULTS.long,
    }));
  };

  const results = calculateDough(formData);
  const previewRows = generatePreviewRows(results);

  const getBakingTime = () => {
    if (!scheduleData.bakingDateTime) return 'Not set';
    const date = new Date(scheduleData.bakingDateTime);
    const datePart = date.toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} ${timePart}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-600 text-center">
        Your Pizza Dough Recipe Preview
      </h2>

      {/* Recipe Summary */}
      <div className="dark:bg-stone-700 bg-white bg-opacity-80 rounded-xl shadow p-6 space-y-4 border border-gray-200 dark:border-stone-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Pizzas:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.numPizzas}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Ball Weight:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.ballWeight}g
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Biga:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.bigaPercent}%
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Biga Hydration:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.bigaHydration}%
            </span>
          </div>
          <div>
            <span className="font-medium text-stone-600 dark:text-stone-300">
              Total Dough:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.numPizzas * formData.ballWeight}g
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Final Hydration:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.finalHydration}%
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Salt:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.saltPercent}%
            </span>
          </div>
          {formData.maltPercent && (
            <div>
              <span className="font-medium text-gray-700 dark:text-stone-300">
                Malt:
              </span>{' '}
              <span className="font-medium text-gray-700 dark:text-stone-300">
                {formData.maltPercent}%
              </span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Yeast Type:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {formData.yeastType}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-stone-300">
              Baking Time:
            </span>{' '}
            <span className="font-medium text-gray-700 dark:text-stone-300">
              {getBakingTime()}
            </span>
          </div>
        </div>
      </div>

      {/* Ingredient Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-amber-600  mb-2 flex items-center justify-center gap-2">
          Ingredient Breakdown
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-stone-900">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-600 dark:bg-stone-800 dark:text-stone-300 text-stone-200">
              <tr>
                <th className="px-4 py-2 border-b">Ingredient</th>
                <th className="px-4 py-2 border-b">Biga</th>
                <th className="px-4 py-2 border-b">Refresh</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Baker’s %</th>
              </tr>
            </thead>
            <tbody className="dark:bg-stone-700 bg-white bg-opacity-80 dark:text-stone-400 font-medium ">
              {previewRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t text-gray-700 dark:text-amber-600"
                >
                  <td className="px-4 py-2 font-medium dark:text-stone-300">
                    {row.label}
                  </td>
                  <td className="px-4 py-2 dark:text-stone-400">{row.biga}</td>
                  <td className="px-4 py-2 dark:text-stone-400">{row.dough}</td>
                  <td className="px-4 py-2 dark:text-stone-400">{row.total}</td>
                  <td className="px-4 py-2 dark:text-stone-400">
                    {row.percent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle Advanced Options */}
        <div className="text-right text-sm">
          <button
            className="text-cyan-500 dark:text-cyan-500 underline hover:text-blue-800 dark:hover:text-cyan-600"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>

        {/* Advanced Sliders */}
        {showAdvanced && (
          <div className="mt-6 space-y-4 rounded-lg bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-600 p-4 rounded">
            <h4 className="font-semibold text-gray-700 dark:text-yellow-700">
              Yeast Correction Factors
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">
                  Short Ferment Correction{' '}
                  <span className="ml-1 font-mono">
                    {(
                      formData.shortCorrection ||
                      YEAST_CORRECTION_DEFAULTS.short
                    ).toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.01"
                  value={
                    formData.shortCorrection || YEAST_CORRECTION_DEFAULTS.short
                  }
                  name="short"
                  onChange={handleCorrectionChange}
                />
                <p className="text-xs text-gray-500 dark:text-yellow-500">
                  Affects refresh yeast when fermentation ≤ 12h
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Long Ferment Correction{' '}
                  <span className="ml-1 font-mono">
                    {(
                      formData.longCorrection || YEAST_CORRECTION_DEFAULTS.long
                    ).toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.9"
                  max="1.5"
                  step="0.01"
                  value={
                    formData.longCorrection || YEAST_CORRECTION_DEFAULTS.long
                  }
                  name="long"
                  onChange={handleCorrectionChange}
                />
                <p className="text-xs text-gray-500 dark:text-yellow-500">
                  Affects biga yeast and refresh ≥ 12h
                </p>
              </div>
              <button
                className="text-sm text-blue-500 underline hover:text-blue-700 mt-2"
                onClick={handleReset}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Prompt */}
      {!isEditing && (
        <div className="text-center mt-6">
          <p className="text-gray-700 dark:text-amber-100">
            Would you like to enter preparation steps and generate a full dough
            timeline?
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="bg-green-600 dark:bg-green-900 text-green-200 dark:text-yellow-200 px-4 py-2 rounded-md shadow hover:bg-green-700 dark:hover:bg-green-800 transition"
              onClick={onCreateSchedule}
            >
              Yes, add prep schedule
            </button>
            <button
              className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 dark:text-yellow-600 dark:bg-red-950 hover:bg-gray-100 dark:hover:bg-red-900 dark:border-none transition"
              onClick={() => {
                toast('Heres your recipe - timeline skipped.');
                onSkip();
              }}
            >
              No thanks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
