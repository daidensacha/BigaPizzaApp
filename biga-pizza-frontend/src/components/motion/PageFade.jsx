// src/components/motion/PageFade.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageFade({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-[calc(100vh-3.5rem)]" // 👈 keeps a stable height during transition
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
