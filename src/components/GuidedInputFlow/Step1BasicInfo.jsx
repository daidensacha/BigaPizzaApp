import React from "react";

export default function Step1BasicInfo({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipe for {data.numPizzas === 1 ? data.numPizzas + " pizza" : data.numPizzas + " pizza's"}
        </label>
        <input
          type="range"
          name="numPizzas"
          value={data.numPizzas || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          // placeholder="e.g. 6"
          min="1"
          max="50"
          unit="pizza"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {data.ballWeight} g per ball
        </label>
        <input
          type="range"
          name="ballWeight"
          value={data.ballWeight || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          // placeholder="e.g. 280"
          min="250"
          max="300"
          unit="g"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {data.bigaPercent} % Biga pizza dough
        </label>
        <input
          type="range"
          name="bigaPercent"
          value={data.bigaPercent || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          // placeholder="e.g. 100"
          min="20"
          max="100"
          unit="%"
        />
      </div>
    </div>
  );
}
