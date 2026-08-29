import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });

    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:scale-105 transition-all duration-300 bg-gold text-black pointer-events-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -3 }}
            aria-label="Back to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}