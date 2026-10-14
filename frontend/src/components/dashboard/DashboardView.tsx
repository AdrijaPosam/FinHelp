import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { StatCard } from './StatCard';
import { SafeDailySpendBanner } from './SafeDailySpendBanner';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { SpendingTrendChart } from './SpendingTrendChart';
import { RecentTransactionsList } from './RecentTransactionsList';
import { SpendingPersonalityCard } from './SpendingPersonalityCard';
import { QuickActionModal } from './QuickActionModal';
import { formatCurrency } from '../../utils/formatters';
import {
  Wallet,
  Receipt,
  PiggyBank,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Target
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { summary, transactions, setActiveTab, profile } = useFinance();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'expense' | 'income'>('expense');

  if (!summary) return null;

  const goalTarget = summary.savings_goal_target || 10000;
  const goalProgress = Math.min(100, Math.round((summary.total_current_savings / goalTarget) * 100));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, {summary.user_name || 'Student'}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's how your pocket money and savings look today.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setQuickActionType('expense');
              setIsQuickActionOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>+ Add Expense</span>
          </button>
          <button
            onClick={() => {
              setQuickActionType('income');
              setIsQuickActionOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 font-bold text-xs sm:text-sm transition-all"
          >
            <span>+ Add Income</span>
          </button>
        </div>
      </div>

      {/* Safe Daily Spend Hero Banner */}
      <SafeDailySpendBanner
        summary={summary}
        onAddExpense={() => {
          setQuickActionType('expense');
          setIsQuickActionOpen(true);
        }}
        onCheckPurchase={() => setActiveTab('reality-check')}
      />

      {/* 4 Core Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Inflow"
          value={formatCurrency(summary.total_monthly_inflow)}
          subtitle={`₹${summary.pocket_money.toLocaleString('en-IN')} allowance ${
            summary.additional_income > 0 ? `+ ₹${summary.additional_income} extra` : ''
          }`}
          icon={Wallet}
          colorScheme="violet"
        />

        <StatCard
          title="Remaining Safe Spend"
          value={formatCurrency(summary.remaining_safe_spend)}
          subtitle={`${summary.days_left} days left at ₹${Math.round(summary.safe_daily_spend)}/day`}
          icon={TrendingDown}
          colorScheme={summary.remaining_safe_spend > 0 ? 'emerald' : 'rose'}
        />

        <StatCard
          title="Total Spent This Month"
          value={formatCurrency(summary.total_expenses)}
          subtitle={`${summary.spend_percentage}% of flexible budget`}
          icon={Receipt}
          colorScheme="amber"
          onClick={() => setActiveTab('tracker')}
        />

        <StatCard
          title="Total Saved"
          value={formatCurrency(summary.total_current_savings)}
          subtitle={`${goalProgress}% of ${summary.savings_goal_name || 'Goal'}`}
          icon={PiggyBank}
          colorScheme="sky"
          onClick={() => setActiveTab('quest')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownChart
          categories={summary.category_breakdown}
          totalExpenses={summary.total_expenses}
        />
        <SpendingTrendChart data={summary.weekly_spending} />
      </div>

      {/* Personality & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SpendingPersonalityCard personality={summary.personality} />

          {/* Quick Savings Goal Progress Widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-violet-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active Goal</h4>
              </div>
              <button
                onClick={() => setActiveTab('quest')}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                View Quests
              </button>
            </div>
            <p className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">
              {summary.savings_goal_name || 'Emergency Fund'}
            </p>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span>{formatCurrency(summary.total_current_savings)} saved</span>
              <span>Target: {formatCurrency(goalTarget)}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <RecentTransactionsList
            transactions={transactions}
            onOpenAll={() => setActiveTab('tracker')}
            onAddTransaction={() => {
              setQuickActionType('expense');
              setIsQuickActionOpen(true);
            }}
          />
        </div>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultType={quickActionType}
      />
    </div>
  );
};
