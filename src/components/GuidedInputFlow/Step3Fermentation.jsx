import React from 'react';
import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";

export default function Step3Fermentation({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Biga Fermentation */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Biga Fermentation</h2>

        <div className="space-y-4">
          <div>
            <FormLabelWithTooltip
              label={`Duration: ${data.bigaTime} hours`}
              tooltip={tooltips.bigaTime}
            />
            {/* <label className="block text-sm font-medium text-blue-700">Duration: {data.bigaTime} hours</label> */}
            <input
              type="range"
              name="bigaTime"
              value={data.bigaTime}
              onChange={onChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
              min="16"
              max="48"
              unit="hours"
            />
          </div>

          <div>
            <FormLabelWithTooltip
              label={`Temperature: ${data.bigaTemp}°C`}
              tooltip={tooltips.bigaTemp}
            />
            {/* <label className="block text-sm font-medium text-blue-700">Temperature: {data.bigaTemp}°C</label> */}
            <input
              type="range"
              name="bigaTemp"
              value={data.bigaTemp}
              onChange={onChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
              min="4"
              max="24"
              unit="C"
            />
          </div>
        </div>
      </div>

      {/* Final Dough Fermentation */}
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <h2 className="text-lg font-semibold text-green-700 mb-2">Final Dough Fermentation</h2>

        <div className="space-y-4">
          <div>
            <FormLabelWithTooltip
              label={`Duration:  ${data.doughTime} hours`}
              tooltip={tooltips.doughTime}
            />
            {/* <label className="block text-sm font-medium text-green-700">Duration: {data.doughTime} hours</label> */}
            <input
              type="range"
              name="doughTime"
              value={data.doughTime}
              onChange={onChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
              min="5"
              max="72"
              unit="hours"
            />
          </div>

          <div>
            <FormLabelWithTooltip
              label={`Temperature: ${data.doughTemp}°C`}
              tooltip={tooltips.doughTemp}
            />
            {/* <label className="block text-sm font-medium text-green-700">Temperature: {data.doughTemp}°C</label> */}
            <input
              type="range"
              name="doughTemp"
              value={data.doughTemp}
              onChange={onChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
              min="4"
              max="24"
              unit="C"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
