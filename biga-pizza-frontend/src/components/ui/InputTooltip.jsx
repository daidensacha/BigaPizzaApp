import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

export default function InputTooltip({ label, min, max, theme = 'light' }) {
  const [hovered, setHovered] = useState(false);
  const isDark = theme === 'dark';
  // console.log("GuidedInputField props:", { min, max, theme});
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-sm text-yellow-500">{label}</span>

      <AnimatePresence>
        {hovered && (min !== undefined || max !== undefined) && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'absolute z-10 mt-2 ml-2 w-max max-w-[180px] px-3 py-1 text-xs rounded-md shadow-lg pointer-events-none',
              isDark
                ? 'bg-stone-700 text-yellow-100'
                : 'bg-white text-gray-800 border border-gray-300'
            )}
          >
            {[
              min !== undefined && `Min: ${min}`,
              max !== undefined && `Max: ${max}`,
            ]
              .filter(Boolean)
              .join(' • ')}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
