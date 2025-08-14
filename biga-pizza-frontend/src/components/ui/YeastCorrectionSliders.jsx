import React from 'react';
import { YEAST_CORRECTION_DEFAULTS } from '@/utils/utils';

export default function YeastCorrectionSliders({
  shortValue,
  longValue,
  onChange, // (name: 'short' | 'long', value: number) => void
  onReset, // () => void
  className = '',
}) {
  return (
    <div
      className={`mt-4 rounded-lg border p-4 bg-white/50 dark:bg-stone-900/50 border-zinc-200 dark:border-stone-700 ${className}`}
    >
      <h4 className="text-sm font-semibold text-gray-700 dark:text-yellow-700 mb-2">
        Yeast Correction Factors
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Long */}
        <div>
          <label className="block text-xs font-medium">
            Long Ferment{' '}
            <span className="ml-1 font-mono">
              {(longValue ?? YEAST_CORRECTION_DEFAULTS.long).toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min="0.9"
            max="1.5"
            step="0.01"
            value={longValue ?? YEAST_CORRECTION_DEFAULTS.long}
            onChange={(e) => onChange('long', parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-gray-500 dark:text-yellow-500">
            Affects biga ≥ 12h
          </p>
        </div>
        {/* end long */}
        {/* Short */}
        <div>
          <label className="block text-xs font-medium">
            Short Ferment{' '}
            <span className="ml-1 font-mono">
              {(shortValue ?? YEAST_CORRECTION_DEFAULTS.short).toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.01"
            value={shortValue ?? YEAST_CORRECTION_DEFAULTS.short}
            onChange={(e) => onChange('short', parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-gray-500 dark:text-yellow-500">
            Affects dough ≤ 12h
          </p>
        </div>
        {/* end long */}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-xs text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
      >
        Reset to defaults
      </button>
    </div>
  );
}
