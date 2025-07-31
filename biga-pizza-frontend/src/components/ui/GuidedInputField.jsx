import React from 'react';
import InputTooltip from './InputTooltip';
import inputConfig from '../../constants/inputConfig';

export default function GuidedInputField({
  name,
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  unit,
}) {
  const isDateTime = type === 'datetime-local';

  return (
    <div className="flex flex-col space-y-1">
      <div className="group relative w-fit">
        <label
          htmlFor={name}
          className="text-sm text-gray-800 dark:text-yellow-500 cursor-pointer"
        >
          {label}
        </label>

        {min !== undefined && max !== undefined && (
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded shadow z-10
               opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap max-w-xs"
          >
            Min: {min} • Max: {max}
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-black z-[-1]"></span>
          </span>
        )}
      </div>

      {isDateTime ? (
        <input
          type="datetime-local"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-800 dark:text-stone-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-yellow-600"
        />
      ) : (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="px-2 py-1 border border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-stone-300 rounded hover:bg-gray-200 dark:hover:bg-stone-700 focus:ring-1 focus:ring-yellow-600"
            onClick={() => {
              const newValue = Math.max(
                parseFloat(value || 0) - (step ?? 1),
                min ?? 0
              );
              onChange({ target: { name, value: newValue } });
            }}
          >
            −
          </button>

          <input
            id={name}
            name={name}
            type="number"
            value={value}
            onChange={onChange}
            step={step ?? 1}
            min={min}
            max={max}
            className="w-24 rounded border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-800 dark:text-stone-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-yellow-600"
          />

          <button
            type="button"
            className="px-2 py-1 border border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-stone-300 rounded hover:bg-gray-200 dark:hover:bg-stone-700 focus:ring-1 focus:ring-yellow-600"
            onClick={() => {
              const newValue = Math.min(
                parseFloat(value || 0) + (step ?? 1),
                max ?? Infinity
              );
              onChange({ target: { name, value: newValue } });
            }}
          >
            +
          </button>

          {unit && (
            <span className="text-sm text-gray-600 dark:text-stone-400 ml-1">
              {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
