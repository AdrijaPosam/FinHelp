import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useFinance();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className="flex items-center space-x-3 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-300">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        <span className="text-sm font-medium pr-2">{toastMessage}</span>
        <button
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
