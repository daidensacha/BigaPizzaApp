// src/components/ui/YeastToggleButtonGroup.jsx
import React from 'react';
import Tooltip from '@/components/ui/Tooltip';

const SIZE = {
  xs: {
    wrap: 'min-w-[9.5rem]',
    seg: 'px-2 h-7 text-[11px]',
    icon: 'w-3.5 h-3.5',
  },
  sm: { wrap: 'min-w-[9.5rem]', seg: 'px-2.5 h-8 text-xs', icon: 'w-4 h-4' },
  md: { wrap: 'min-w-[11rem]', seg: 'px-3 h-9 text-sm', icon: 'w-4.5 h-4.5' },
};

const LABELS = {
  idy: 'Instant Dry (IDY)',
  ady: 'Active Dry (ADY)',
  fresh: 'Fresh',
};

export default function YeastToggleButtonGroup({
  value = 'idy',
  onChange,
  options = ['idy', 'ady', 'fresh'],
  size = 'sm',
  align = 'start',
  className = '',
  label = 'Yeast Type',
  optionHelp, // e.g. { idy: 'Instant Dry Yeast', ady: 'Active Dry Yeast', fresh: 'Fresh yeast', side: 'bottom' }
  tooltipSide = 'top', // ✅ correct prop name
}) {
  const S = SIZE[size] ?? SIZE.sm;
  const alignClass = align === 'start' ? 'items-start' : 'items-center';
  const labelAlign = align === 'start' ? 'text-left' : 'text-center';

  // allow putting `side` inside optionHelp, otherwise use prop
  const { side: helpSideInMap, ...helpMap } = optionHelp || {};
  const resolvedSide = helpSideInMap || tooltipSide;

  return (
    <div className={`flex flex-col gap-1 ${S.wrap} ${className} ${alignClass}`}>
      <label
        className={`font-medium text-zinc-600 dark:text-stone-400 ${labelAlign} ${
          size === 'xs' ? 'text-[11px]' : 'text-xs'
        }`}
      >
        {label}
      </label>

      <div
        role="radiogroup"
        aria-label="Yeast Type"
        className="
          inline-flex rounded-md overflow-visible
          border border-zinc-300 dark:border-zinc-700
          bg-white dark:bg-stone-900 shadow-sm isolate
        "
      >
        {options.map((opt, i) => {
          const active = value === opt;
          const isFirst = i === 0;
          const isLast = i === options.length - 1;

          const btn = (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={LABELS[opt] || opt}
              onClick={() => onChange?.(opt)}
              className={[
                'relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-zinc-300/20',
                S.seg,
                active
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-stone-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-stone-800',
                !isFirst && 'border-l border-zinc-300 dark:border-zinc-700',
                isFirst ? 'rounded-l-md' : '',
                isLast ? 'rounded-r-md' : '',
              ].join(' ')}
            >
              <span className="sr-only">{LABELS[opt] || opt}</span>
              <span aria-hidden>{opt.toUpperCase()}</span>
            </button>
          );

          const help = helpMap[opt]; // ✅ use the spread map
          return help ? (
            <Tooltip key={opt} content={help} side={resolvedSide}>
              {btn}
            </Tooltip>
          ) : (
            btn
          );
        })}
      </div>

      <div
        className={`${
          size === 'xs' ? 'text-[10px]' : 'text-[11px]'
        } text-zinc-500`}
      >
        Choose the yeast you typically use.
      </div>
    </div>
  );
}
