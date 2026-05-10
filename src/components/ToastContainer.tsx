import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed bottom-6 right-4 z-[9998] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className="pointer-events-auto glass rounded-xl px-4 py-3 flex items-center gap-3 min-w-64 max-w-xs shadow-xl"
            style={{ borderColor: toast.type === 'success' ? 'rgba(201,168,76,0.4)' : toast.type === 'error' ? 'rgba(200,60,60,0.4)' : 'rgba(100,160,220,0.4)' }}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            {toast.type === 'success' && <CheckCircle size={18} className="text-gold flex-shrink-0" />}
            {toast.type === 'error' && <XCircle size={18} className="text-red-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-400 flex-shrink-0" />}
            <span className="text-sm text-[var(--text)] flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
