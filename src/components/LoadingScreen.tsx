import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full bg-gold/20 blur-[90px]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.8, 0.35], scale: [0.4, 1.05, 0.85] }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                'radial-gradient(circle at center, rgba(201,168,76,0.16), transparent 35%)',
            }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.55, rotateX: 25 }}
              animate={{
                opacity: 1,
                scale: [0.55, 1.08, 1],
                rotateX: [25, 0, 0],
              }}
              exit={{ scale: 1.15, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-gold/30"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />

              <motion.img
                src="/images/Logo.png"
                alt="Wildcore Logo"
                className="relative z-10 w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(201,168,76,0.45)]"
                animate={{
                  y: [0, -6, 0],
                  filter: [
                    'drop-shadow(0 0 8px rgba(201,168,76,0.35))',
                    'drop-shadow(0 0 24px rgba(201,168,76,0.75))',
                    'drop-shadow(0 0 8px rgba(201,168,76,0.35))',
                  ],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            <motion.h1
              className="mt-6 text-3xl sm:text-4xl font-serif text-gold uppercase tracking-[0.35em]"
              initial={{ opacity: 0, y: 14, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.35em' }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              Wildcore
            </motion.h1>

            <motion.p
              className="mt-3 text-xs tracking-[0.55em] text-white/45 uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Fragrances
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ width: 0, left: '50%' }}
            animate={{ width: '100%', left: 0 }}
            transition={{ duration: 1.8, delay: 0.35, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}