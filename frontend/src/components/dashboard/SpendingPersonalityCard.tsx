import React from 'react';
import { SpendingPersonality } from '../../types';
import { Sparkles, Info } from 'lucide-react';

interface SpendingPersonalityCardProps {
  personality: SpendingPersonality | null;
}

export const SpendingPersonalityCard: React.FC<SpendingPersonalityCardProps> = ({
  personality
}) => {
  if (!personality) return null;

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-violet-500/10 to-emerald-500/10 dark:from-amber-950/20 dark:via-violet-950/20 dark:to-emerald-950/20 border border-amber-200/50 dark:border-amber-800/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-2xl shrink-0">
            {personality.badge_icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                Your Financial Persona
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {personality.title}
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-3">
        "{personality.tagline}"
      </p>

      <div className="mt-3 p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
        <span>{personality.reason}</span>
      </div>
    </div>
  );
};
