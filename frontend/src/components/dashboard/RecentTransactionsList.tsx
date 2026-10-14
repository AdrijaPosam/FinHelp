import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, getCategoryMeta } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, PiggyBank, ReceiptText, ChevronRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  onOpenAll: () => void;
  onAddTransaction: () => void;
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
  onOpenAll,
  onAddTransaction
}) => {
  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center text-center h-80">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-3">
          <ReceiptText className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No activity recorded yet</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Click "+ Log Spend" to record your first campus expense.
        </p>
        <button
          onClick={onAddTransaction}
          className="mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors"
        >
          + Add First Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest transactions logged</p>
        </div>
        <button
          onClick={onOpenAll}
          className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center space-x-1"
        >
          <span>View All ({transactions.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {recent.map((tx) => {
          const meta = getCategoryMeta(tx.category);
          const isIncome = tx.type === 'income';
          const isSaved = tx.type === 'savings_deposit';

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3 truncate">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base ${
                    isIncome
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : isSaved
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                      : meta.bgColor + ' ' + meta.color
                  }`}
                >
                  {isIncome ? '💰' : isSaved ? '🎯' : meta.icon}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {tx.note || tx.category}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{formatDate(tx.date)}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium">
                      {tx.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <p
                  className={`text-sm font-black ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isSaved
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {isIncome ? '+' : isSaved ? 'Saved ' : '-'}
                  {formatCurrency(tx.amount)}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">{tx.type.replace('_', ' ')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
