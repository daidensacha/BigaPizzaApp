import React from "react";
import { Clock } from 'lucide-react';
import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";

export default function Step1BasicInfo({ data, onChange }) {

  function formatDateTime(datetimeStr) {
  const date = new Date(datetimeStr);
  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

  return (
    <div className="space-y-4">
      {/* Number of Pizzas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipe for {data.numPizzas === 1 ? "1 pizza" : `${data.numPizzas} pizzas`}
        </label>
        <input
          type="range"
          name="numPizzas"
          value={data.numPizzas || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          min="1"
          max="50"
        />
      </div>

      {/* Ball Weight */}
      <div>
        <FormLabelWithTooltip
          label={`${data.ballWeight}g per ball`}
          tooltip={tooltips.ballWeight}
        />
        <input
          type="range"
          name="ballWeight"
          value={data.ballWeight || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          min="250"
          max="300"
        />
      </div>

      {/* Biga % */}
      <div>
        <FormLabelWithTooltip
          label={`${data.bigaPercent}% Biga pizza dough`}
          tooltip={tooltips.bigaPercent}
        />
        <input
          type="range"
          name="bigaPercent"
          value={data.bigaPercent || ""}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
          min="20"
          max="100"
        />
      </div>

      {/* Baking Date & Time */}
      <div className="relative">
        <FormLabelWithTooltip
          label={`Baking Date and Time`}
          tooltip={tooltips.bakingDateTime}
        />
        <Clock className="absolute left-3 top-11 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="datetime-local"
          name="bakingDateTime"
          value={data.bakingDateTime || ''}
          onChange={onChange}
          className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
        />
      </div>
    </div>
  );
}
