import React from "react";
import { calculateDough, YEAST_CORRECTION_DEFAULTS } from "../../utils/utils";
import { useRecipe } from "../../context/RecipeContext";
import {
  formatGrams,
  formatBakersPercent,
  generatePreviewRows,
} from "../../utils/previewHelpers";

export default function Step5RecipePreview({
  onCreateSchedule,
  onSkip,
}) {
  const { formData, setFormData } = useRecipe();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
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
    if (!formData.bakingDateTime) return "Not set";
    const date = new Date(formData.bakingDateTime);
    const datePart = date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} ${timePart}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-500 text-center">
        Your Pizza Dough Recipe Preview
      </h2>

      {/* Recipe Summary */}
      <div className="bg-white dark:bg-neutral-800 dark:bg-opacity-90 rounded-xl shadow p-6 space-y-4 border border-gray-200 dark:border-stone-600">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Pizzas:</span> {formData.numPizzas}
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Ball Weight:</span> {formData.ballWeight}g
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Biga:</span> {formData.bigaPercent}%
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Biga Hydration:</span> {formData.bigaHydration}%
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Total Dough:</span> {formData.numPizzas * formData.ballWeight}g
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Final Hydration:</span> {formData.finalHydration}%
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Salt:</span> {formData.saltPercent}%
          </div>
          {formData.maltPercent && (
            <div>
              <span className="font-medium text-gray-700 dark:text-amber-400">Malt:</span> {formData.maltPercent}%
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Yeast Type:</span> {formData.yeastType}
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-amber-400">Baking Time:</span> {getBakingTime()}
          </div>
        </div>
      </div>

      {/* Ingredient Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-amber-500 mb-2 flex items-center justify-center gap-2">
          Ingredient Breakdown
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-stone-900">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-stone-700 text-stone-200">
              <tr>
                <th className="px-4 py-2 border-b">Ingredient</th>
                <th className="px-4 py-2 border-b">Biga</th>
                <th className="px-4 py-2 border-b">Refresh</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Baker’s %</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.label} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-700 dark:text-amber-400 dark:bg-stone-900">
                    {row.label}
                  </td>
                  <td className="px-4 py-2 dark:bg-stone-900">{row.biga}</td>
                  <td className="px-4 py-2 dark:bg-stone-900">{row.dough}</td>
                  <td className="px-4 py-2 dark:bg-stone-900">{row.total}</td>
                  <td className="px-4 py-2 dark:bg-stone-900">{row.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle Advanced Options */}
        <div className="text-right text-sm">
          <button
            className="text-cyan-300 dark:text-cyan-500 underline hover:text-blue-800 dark:hover:text-cyan-600"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>
        </div>

        {/* Advanced Sliders */}
        {showAdvanced && (
          <div className="mt-6 space-y-4 rounded-lg bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-600 p-4 rounded">
            <h4 className="font-semibold text-gray-700 dark:text-yellow-700">Yeast Correction Factors</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">
                  Short Ferment Correction <span className="ml-1 font-mono">{(formData.shortCorrection || YEAST_CORRECTION_DEFAULTS.short).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.01"
                  value={formData.shortCorrection || YEAST_CORRECTION_DEFAULTS.short}
                  name="short"
                  onChange={handleCorrectionChange}
                />
                <p className="text-xs text-gray-500 dark:text-yellow-500">
                  Affects refresh yeast when fermentation ≤ 12h
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Long Ferment Correction <span className="ml-1 font-mono">{(formData.longCorrection || YEAST_CORRECTION_DEFAULTS.long).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.9"
                  max="1.5"
                  step="0.01"
                  value={formData.longCorrection || YEAST_CORRECTION_DEFAULTS.long}
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
      <div className="text-center mt-6">
        <p className="text-gray-700 dark:text-amber-100">
          Would you like to enter preparation steps and generate a full dough timeline?
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
            onClick={onSkip}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
