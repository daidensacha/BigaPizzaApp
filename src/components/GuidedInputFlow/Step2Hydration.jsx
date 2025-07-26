import React from 'react';
import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";

export default function Step2Hydration({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Biga Hydration */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div>
          <FormLabelWithTooltip tooltip={tooltips.bigaHydration}>
            Biga Hydration: {data.bigaHydration}%
          </FormLabelWithTooltip>
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
          <FormLabelWithTooltip tooltip={tooltips.finalHydration}>
            Final Dough Hydration: {data.finalHydration}%
          </FormLabelWithTooltip>
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
          <FormLabelWithTooltip tooltip={tooltips.saltPercent}>
            Salt Percentage: {data.saltPercent}%
          </FormLabelWithTooltip>
          <FormLabelWithTooltip
            label={`Salt Percentage:  ${data.saltPercent}%`}
            tooltip={tooltips.saltPercent}
          />
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
          <FormLabelWithTooltip tooltip={tooltips.maltPercent}>
            Malt Percentage (optional): {data.maltPercent}%
          </FormLabelWithTooltip>
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
