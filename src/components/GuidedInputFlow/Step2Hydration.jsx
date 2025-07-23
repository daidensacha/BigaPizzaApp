import React from 'react';

export default function Step2Hydration({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Biga Hydration */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Biga Hydration: <span className="font-bold">{data.bigaHydration}%</span>
          </label>
          <input
            type="range"
            name="bigaHydration"
            min="40"
            max="60"
            step="1"
            value={data.bigaHydration}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      {/* Final Dough Hydration */}
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Final Dough Hydration: <span className="font-bold">{data.finalHydration}%</span>
          </label>
          <input
            type="range"
            name="finalHydration"
            min="60"
            max="80"
            step="1"
            value={data.finalHydration}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      {/* Salt Percentage */}
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-1">
            Salt Percentage: <span className="font-bold">{data.saltPercent}%</span>
          </label>
          <input
            type="range"
            name="saltPercent"
            min="2"
            max="4"
            step="0.1"
            value={data.saltPercent}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      {/* Malt Percentage (Optional) */}
      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">
            Malt Percentage (optional): <span className="font-bold">{data.maltPercent}%</span>
          </label>
          <input
            type="range"
            name="maltPercent"
            min="0"
            max="1"
            step="0.05"
            value={data.maltPercent}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
