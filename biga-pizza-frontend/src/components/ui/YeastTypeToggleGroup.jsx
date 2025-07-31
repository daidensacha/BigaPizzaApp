import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

const yeastOptions = [
  { label: 'IDY', value: 'idy', description: 'Instant Dry Yeast' },
  { label: 'ADY', value: 'ady', description: 'Active Dry Yeast' },
  { label: 'Fresh', value: 'fresh', description: 'Fresh Yeast' },
];

export default function YeastTypeToggleGroup({
  value,
  onChange,
  theme = 'light',
  name = 'yeastType',
}) {
  const [hovered, setHovered] = useState(null);
  const isDark = theme === 'dark';

  const base = isDark
    ? 'bg-stone-800 text-yellow-200 border-yellow-700'
    : 'bg-white text-gray-800 border-gray-300';

  const selected = isDark
    ? 'bg-yellow-600 text-white shadow-md border-yellow-600'
    : 'bg-red-600 text-white shadow-md border-red-600';

  const ring = isDark ? 'focus:ring-yellow-500' : 'focus:ring-red-500';

  return (
    <div className="flex space-x-2 relative">
      {yeastOptions.map((option, index) => {
        const isActive = value === option.value;

        const buttonClass = clsx(
          'px-4 py-2 text-sm font-medium rounded-xl border focus:outline-none focus:ring-offset-0',
          isActive ? selected : base,
          ring
        );

        return (
          <div
            key={option.value}
            className="relative flex flex-col items-center"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() =>
                onChange({ target: { name, value: option.value } })
              }
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className={buttonClass}
            >
              {option.label}
            </motion.button>

            <AnimatePresence>
              {hovered === index && (
                <motion.div
                  key="tooltip"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    'absolute z-10 mt-10 w-max max-w-[160px] px-3 py-1 text-xs rounded-lg shadow-lg pointer-events-none',
                    isDark
                      ? 'bg-stone-700 text-yellow-100'
                      : 'bg-white text-gray-800 border border-gray-300'
                  )}
                >
                  {option.description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
