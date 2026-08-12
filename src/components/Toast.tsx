import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-start space-x-3 backdrop-blur-md ${
        toast.type === 'success'
          ? 'bg-[#12080A]/95 text-amber-50 border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
          : toast.type === 'error'
          ? 'bg-rose-950/95 text-rose-50 border-rose-500/50 shadow-rose-950/50'
          : 'bg-zinc-900/95 text-zinc-100 border-zinc-700 shadow-black/50'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400" />
        ) : (
          <Info className="w-5 h-5 text-amber-300" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <h5 className="text-xs font-bold leading-tight text-[#D4AF37] font-serif">
          {toast.title}
        </h5>
        {toast.description && (
          <p className="text-[11px] text-amber-100/80 mt-0.5 leading-normal">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-amber-200/60 hover:text-amber-100 p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
