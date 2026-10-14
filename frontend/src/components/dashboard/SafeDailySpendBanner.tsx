import React from 'react';
import { Calendar, ShieldAlert, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardSummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SafeDailySpendBannerProps {
  summary: DashboardSummary | null;
  onAddExpense: () => void;
  onCheckPurchase: () => void;
}

export const SafeDailySpendBanner: React.FC<SafeDailySpendBannerProps> = ({
  summary,
  onAddExpense,
  onCheckPurchase
}) => {
  if (!summary) return null;

  const pace = summary.spending_pace_status;
  const isHealthy = pace === 'healthy';
  const isCaution = pace === 'caution';
  const isOver = pace === 'overspending';

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-60 h-60 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/15 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-300" />
              <span>
                Day {summary.current_day} of {summary.total_days} ({summary.days_left} Days Left)
              </span>
            </span>

            {isHealthy && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Healthy Pace</span>
              </span>
            )}
            {isCaution && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Caution Pace</span>
              </span>
            )}
            {isOver && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Overspending Alert</span>
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-3 mt-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {formatCurrency(summary.safe_daily_spend)}
            </h2>
            <span className="text-sm sm:text-base font-semibold text-slate-300">
              / safe daily spend
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {summary.pace_message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={onAddExpense}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>+ Log Spend</span>
          </button>
          <button
            onClick={onCheckPurchase}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-violet-300" />
            <span>Reality Check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
