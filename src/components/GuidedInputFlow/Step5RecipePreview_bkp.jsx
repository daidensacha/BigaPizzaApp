import React from "react";

export default function Step5RecipePreview({ data, onCreateSchedule, onSkip }) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Your Pizza Dough Recipe Preview
      </h2>

      {/* Recipe Summary */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium text-gray-700">Pizzas:</span> {data.numPizzas}</div>
          <div><span className="font-medium text-gray-700">Ball Weight:</span> {data.ballWeight}g</div>

          <div><span className="font-medium text-gray-700">Biga:</span> {data.bigaPercent}%</div>
          <div><span className="font-medium text-gray-700">Biga Hydration:</span> {data.bigaHydration}%</div>

          <div><span className="font-medium text-gray-700">Total Dough:</span> {data.numPizzas * data.ballWeight}g</div>
          <div><span className="font-medium text-gray-700">Final Hydration:</span> {data.finalHydration}%</div>
          <div><span className="font-medium text-gray-700">Salt:</span> {data.saltPercent}%</div>

          {data.maltPercent && (
            <div><span className="font-medium text-gray-700">Malt:</span> {data.maltPercent}%</div>
          )}

          <div>
            <span className="font-medium text-gray-700">Yeast Type:</span> {data.yeastType}
          </div>

          <div>
            <span className="font-medium text-gray-700">Baking Time:</span>{" "}
              {data.bakingDateTime
                ? (() => {
                    const date = new Date(data.bakingDateTime);
                    const datePart = date.toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });
                    const timePart = date.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });
                    return `${datePart} @ ${timePart}`;
                  })()
                : "Not set"}
          </div>
        </div>
      </div>

      {/* Schedule Prompt */}
      <div className="text-center mt-6">
        <p className="text-gray-700">Would you like to enter preparation steps and generate a full dough timeline?</p>
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
