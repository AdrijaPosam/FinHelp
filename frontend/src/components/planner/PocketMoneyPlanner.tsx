import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';
import { formatCurrency, getCategoryMeta } from '../../utils/formatters';
import {
  PieChart,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const PocketMoneyPlanner: React.FC = () => {
  const { profile, updateProfile, setToastMessage, summary } = useFinance();
  const [plannerData, setPlannerData] = useState<any>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<{ category: string; amount: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [profile]);

  const loadPlan = async () => {
    try {
      const plan = await api.getSmartBudgetPlan();
      setPlannerData(plan);

      // Load existing allocations or suggested defaults
      const existing = await api.getBudgets();
      if (existing && existing.length > 0 && existing.some((b) => b.allocated_amount > 0)) {
        setCategoryBudgets(
          existing.map((b) => ({ category: b.category, amount: b.allocated_amount }))
        );
      } else {
        setCategoryBudgets(
          plan.suggested_categories.map((s: any) => ({
            category: s.category,
            amount: s.suggested_amount
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAmountChange = (category: string, newAmount: number) => {
    setCategoryBudgets((prev) =>
      prev.map((item) => (item.category === category ? { ...item, amount: newAmount } : item))
    );
  };

  const handleSaveBudgets = async () => {
    try {
      setIsSaving(true);
      await api.saveBudgets(
        categoryBudgets.map((b) => ({ category: b.category, allocated_amount: b.amount }))
      );
      setToastMessage('Category budgets successfully updated!');
    } catch (err) {
      setToastMessage('Failed to save budgets');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyDefaults = () => {
    if (plannerData?.suggested_categories) {
      setCategoryBudgets(
        plannerData.suggested_categories.map((s: any) => ({
          category: s.category,
          amount: s.suggested_amount
        }))
      );
      setToastMessage('Reset to recommended smart student allocations!');
    }
  };

  if (!plannerData) {
    return (
      <div className="p-12 text-center text-slate-400">Loading pocket money planner...</div>
    );
  }

  const totalAllocated = categoryBudgets.reduce((acc, curr) => acc + curr.amount, 0);
  const pool = plannerData.flexible_spend_pool || 1;
  const difference = pool - totalAllocated;
  const isOverBudget = difference < -10;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Pocket Money Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized guidance tailored for your monthly allowance and campus lifestyle.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleApplyDefaults}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Recommended</span>
          </button>

          <button
            onClick={handleSaveBudgets}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Allocations'}</span>
          </button>
        </div>
      </div>

      {/* Rationale and Philosophy Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-emerald-50 dark:from-violet-950/40 dark:to-emerald-950/40 border border-violet-200/60 dark:border-violet-800/40">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-violet-600 text-white shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Why this budget works for you
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {plannerData.rationale}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Safe Daily Spend: ₹{plannerData.safe_daily_guidance}/day
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Safe Weekly Allowance: ₹{plannerData.safe_weekly_guidance}/week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            1. Total Pocket Inflow
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(plannerData.monthly_pocket_money)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Minus ₹{plannerData.fixed_expenses} fixed PG/Transit bills
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            2. Recommended Savings
          </p>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {formatCurrency(plannerData.recommended_savings)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{plannerData.saving_style_label}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            3. Flexible Spend Pool
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(plannerData.flexible_spend_pool)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Available for category allocation</p>
        </div>
      </div>

      {/* Allocation Budget Check Bar */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isOverBudget
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center space-x-2">
            {isOverBudget ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span
              className={`font-bold ${
                isOverBudget ? 'text-rose-800 dark:text-rose-200' : 'text-emerald-800 dark:text-emerald-200'
              }`}
            >
              {isOverBudget
                ? `Allocations exceed flexible pool by ₹${Math.abs(difference).toLocaleString('en-IN')}`
                : `Balanced! ₹${difference.toLocaleString('en-IN')} unallocated cushion remaining.`}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Total Allocated: <span className="font-black">₹{totalAllocated.toLocaleString('en-IN')}</span> / ₹
            {pool.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Interactive Category Sliders */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Customize Flexible Category Budgets
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust sliders to fit your campus priorities. These are guidance goals, never rigid punishments!
          </p>
        </div>

        <div className="space-y-5">
          {categoryBudgets.map((item) => {
            const meta = getCategoryMeta(item.category);
            const maxVal = Math.round(pool * 0.7);

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200">
                    <span>{meta.icon}</span>
                    <span>{item.category}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">
                      ({Math.round((item.amount / Math.max(1, pool)) * 100)}%)
                    </span>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1">
                      <span className="text-xs text-slate-400 mr-1">₹</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleAmountChange(
                            item.category,
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-16 bg-transparent text-right font-black text-sm text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max={maxVal}
                  step="50"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(item.category, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={handleSaveBudgets}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Category Budgets'}
          </button>
        </div>
      </div>
    </div>
  );
};
