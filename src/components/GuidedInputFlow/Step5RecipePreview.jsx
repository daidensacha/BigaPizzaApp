import React from "react";
import { calculateDough, YEAST_CORRECTION_DEFAULTS } from "../../utils/utils";
import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";

export default function Step5RecipePreview({
  data,
  setData,
  onCreateSchedule,
  onSkip,
  correctionFactors,
  setCorrectionFactors,
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  function formatGrams(value, type = "default") {
    const num = parseFloat(value);
    if (isNaN(num)) return "–";

    if (type === "yeast" || type === "malt") {
      return `${num.toFixed(2)}g`;
    }

    // Salt, flour, water: round to whole grams
    return `${Math.round(num)}g`;
  }

  function formatBakersPercent(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return "–";
    return num < 1 ? `${num.toFixed(2)}%` : `${num.toFixed(1)}%`;
  }

  const handleCorrectionChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [`${name}Correction`]: parseFloat(value),
    }));
  };


const handleReset = () => {
  // setCorrectionFactors({ ...YEAST_CORRECTION_DEFAULTS });
  setData((prev) => ({
    ...prev,
    shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
    longCorrection: YEAST_CORRECTION_DEFAULTS.long,
  }));
};


  const results = calculateDough(data);
  const { bigaYeast, refreshYeast, totalFlour } = results;

  const getPercent = (value) =>
    value ? `${((value / totalFlour) * 100).toFixed(1)}%` : "-";

  const previewRows = [
    {
      label: "Flour",
      biga: formatGrams(results.bigaFlour, "flour"),
      dough: formatGrams(results.finalFlour, "flour"),
      total: formatGrams(results.totalFlour, "flour"),
      percent: "100%",
    },
    {
      label: "Water",
      biga: formatGrams(results.bigaWater, "water"),
      dough: formatGrams(results.finalWater, "water"),
      total: formatGrams(results.totalWater, "water"),
      percent: getPercent(results.totalWater),
    },
    {
      label: "Salt",
      biga: "-",
      dough: formatGrams(results.totalSalt, "salt"),
      total: formatGrams(results.totalSalt, "salt"),
      percent: getPercent(results.totalSalt),
    },
    {
      label: "Malt",
      biga: "-",
      dough: formatGrams(results.totalMalt, "malt"),
      total: formatGrams(results.totalMalt, "malt"),
      percent: getPercent(results.totalMalt),
    },
    {
      label: "Yeast",
      biga: `${formatGrams(results.bigaYeast, "yeast")} (${formatBakersPercent(results.bigaYeastPercent)})`,
      dough: `${formatGrams(results.refreshYeast, "yeast")} (${formatBakersPercent(results.refreshYeastPercent)})`,
      total: formatGrams(results.bigaYeast + results.refreshYeast, "yeast"),
      percent: formatBakersPercent(results.totalYeastPercent),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Your Pizza Dough Recipe Preview
      </h2>

      {/* Recipe Summary */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Pizzas:</span>{" "}
            {data.numPizzas}
          </div>
          <div>
            <span className="font-medium text-gray-700">Ball Weight:</span>{" "}
            {data.ballWeight}g
          </div>

          <div>
            <span className="font-medium text-gray-700">Biga:</span>{" "}
            {data.bigaPercent}%
          </div>
          <div>
            <span className="font-medium text-gray-700">Biga Hydration:</span>{" "}
            {data.bigaHydration}%
          </div>

          <div>
            <span className="font-medium text-gray-700">Total Dough:</span>{" "}
            {data.numPizzas * data.ballWeight}g
          </div>
          <div>
            <span className="font-medium text-gray-700">Final Hydration:</span>{" "}
            {data.finalHydration}%
          </div>
          <div>
            <span className="font-medium text-gray-700">Salt:</span>{" "}
            {data.saltPercent}%
          </div>

          {data.maltPercent && (
            <div>
              <span className="font-medium text-gray-700">Malt:</span>{" "}
              {data.maltPercent}%
            </div>
          )}

          <div>
            <span className="font-medium text-gray-700">Yeast Type:</span>{" "}
            {data.yeastType}
          </div>

          <div>
            <span className="font-medium text-gray-700">Baking Time:</span>{" "}
            {data.bakingDateTime
              ? (() => {
                  const date = new Date(data.bakingDateTime);
                  const datePart = date.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const timePart = date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                  return `${datePart} @ ${timePart}`;
                })()
              : "Not set"}
          </div>
        </div>
      </div>

      {/* Ingredient Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          Ingredient Breakdown
          <FormLabelWithTooltip tooltip={tooltips.ingredientBreakdown}/>
        </h3>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
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
                  <td className="px-4 py-2 font-medium text-gray-700">
                    {row.label}
                  </td>
                  <td className="px-4 py-2">{row.biga}</td>
                  <td className="px-4 py-2">{row.dough}</td>
                  <td className="px-4 py-2">{row.total}</td>
                  <td className="px-4 py-2">
                    {formatBakersPercent(row.percent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle Advanced Options */}
        <div className="text-right text-sm">
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>
        </div>

        {/* Advanced Sliders */}
        {showAdvanced && (
          <div className="mt-6 space-y-4 bg-gray-50 border border-gray-200 p-4 rounded">
            <h4 className="font-semibold text-gray-700">
              Yeast Correction Factors
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">
                  Short Ferment Correction <span className="ml-1 font-mono">{(data.shortCorrection || YEAST_CORRECTION_DEFAULTS.short).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.01"
                  value={data.shortCorrection || YEAST_CORRECTION_DEFAULTS.short}
                  name="short"
                  onChange={handleCorrectionChange}
                />
                <p className="text-xs text-gray-500">
                  Affects refresh yeast when fermentation ≤ 12h
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Long Ferment Correction <span className="ml-1 font-mono">{(data.longCorrection || YEAST_CORRECTION_DEFAULTS.long).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.9"
                  max="1.5"
                  step="0.01"
                  value={data.longCorrection || YEAST_CORRECTION_DEFAULTS.long}
                  name="long"
                  onChange={handleCorrectionChange}
                />
                <p className="text-xs text-gray-500">
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
        <p className="text-gray-700">
          Would you like to enter preparation steps and generate a full dough
          timeline?
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
            onClick={onCreateSchedule}
          >
            Yes, add prep schedule
          </button>
          <button
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={onSkip}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
