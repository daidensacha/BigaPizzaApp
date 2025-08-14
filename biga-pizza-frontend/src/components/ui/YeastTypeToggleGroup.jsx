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
  onChange, // expects event-like: { target: { name, value } }
  name = 'yeastType',
}) {
  const [hovered, setHovered] = useState(null);

  // Tailwind-only theme classes (no prop needed)
  const base =
    'bg-white text-gray-800 border-gray-300 ' +
    'dark:bg-stone-800 dark:text-yellow-200 dark:border-yellow-700';

  const selected =
    'bg-red-600 text-white shadow-md border-red-600 ' +
    'dark:bg-yellow-800 dark:text-white dark:border-yellow-600';

  const ring = 'focus:ring-red-500 dark:focus:ring-yellow-500';

  return (
    <div className="flex space-x-2 relative">
      {yeastOptions.map((option, index) => {
        const isActive = value === option.value;
        const buttonClass = clsx(
          'px-4 py-2 text-sm font-medium rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-0',
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
                    'absolute z-10 mt-10 w-max max-w-[160px] px-3 py-1 text-xs rounded-lg shadow-lg pointer-events-none border',
                    'bg-white text-gray-800 border-gray-300',
                    'dark:bg-stone-700 dark:text-yellow-100 dark:border-yellow-700'
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
