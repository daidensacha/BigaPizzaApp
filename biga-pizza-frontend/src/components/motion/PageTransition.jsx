import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageTransition({
  children,
  minHeight = 'calc(100vh - 3.5rem)',
}) {
  const location = useLocation();

  return (
    <div
      className="relative"
      style={{ minHeight }} // keeps layout stable
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="absolute inset-0" // stack pages on top of each other
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
