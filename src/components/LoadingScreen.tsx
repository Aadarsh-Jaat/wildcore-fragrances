import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.img
              src="/images/Logo.png"
              alt="Wildcore Logo"
              className="w-20 h-20 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.h1
              className="text-3xl font-serif text-gold tracking-[0.3em] uppercase"
              initial={{ letterSpacing: '0.1em', opacity: 0 }}
              animate={{ letterSpacing: '0.3em', opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {/* Wildcore */}
            </motion.h1>
            <motion.p
              className="text-xs tracking-[0.5em] text-[var(--text-muted)] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Fragrances
            </motion.p>
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ width: 0, left: '50%' }}
            animate={{ width: '100%', left: 0 }}
            transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
