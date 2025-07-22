import React from 'react';

export default function Step2Hydration({ data, onChange }) {


  return (
    <div className="space-y-6">
      {/* Biga Hydration */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        {/* <h2 className="text-lg font-semibold text-blue-700 mb-2">Biga Hydration</h2> */}
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
        {/* <h2 className="text-lg font-semibold text-green-700 mb-2">Final Dough Hydration</h2> */}
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
    </div>
  );
}
