import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';
import { formatCurrency, formatDate, triggerGoalCelebration } from '../../utils/formatters';
import {
  Trophy,
  Target,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Coins,
  Calculator
} from 'lucide-react';
import { DailySaverSimulator } from '../insights/DailySaverSimulator';

export const SavingsQuestView: React.FC = () => {
  const { goals, challenges, badges, depositToGoal, setToastMessage, refreshAll } = useFinance();

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  // New Goal Form
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newInitialSaved, setNewInitialSaved] = useState('');
  const [newIcon, setNewIcon] = useState('🎯');

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goalIcons = ['🎯', '💻', '🏖️', '🎧', '👟', '📱', '📚', '🚀', '🎸'];

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(newTarget);
    if (!newTitle || !targetVal || targetVal <= 0) return;

    try {
      setIsSubmitting(true);
      await api.createSavingsGoal({
        title: newTitle.trim(),
        target_amount: targetVal,
        saved_amount: parseFloat(newInitialSaved) || 0,
        icon: newIcon
      });
      setToastMessage(`Created savings quest: "${newTitle}"! 🚀`);
      setIsNewGoalModalOpen(false);
      setNewTitle('');
      setNewTarget('');
      setNewInitialSaved('');
      await refreshAll();
    } catch (err) {
      setToastMessage('Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(depositAmount);
    if (!selectedGoalId || !amountVal || amountVal <= 0) return;

    try {
      setIsSubmitting(true);
      await depositToGoal(selectedGoalId, amountVal, depositMethod);
      setIsDepositModalOpen(false);
      setDepositAmount('');
    } catch (err) {
      // toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm('Delete this savings goal?')) {
      try {
        await api.deleteSavingsGoal(goalId);
        setToastMessage('Goal removed');
        await refreshAll();
      } catch (err) {
        setToastMessage('Failed to delete goal');
      }
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Gamified Quests & Habits
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Savings Quest & Challenges
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn saving pocket money into an exciting game. Hit targets, conquer streaks, and collect badges!
          </p>
        </div>

        <button
          onClick={() => setIsNewGoalModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Quest</span>
        </button>
      </div>

      {/* 1. Active Savings Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-violet-500" />
            <span>Active Savings Goals ({goals.length})</span>
          </h3>
        </div>

        {goals.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <Coins className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No savings goals set yet</p>
            <p className="text-xs text-slate-400 mt-1">
              What do you dream of buying? A new laptop, concert ticket, or trip?
            </p>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs"
            >
              + Create First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.saved_amount / g.target_amount) * 100));
              const remaining = Math.max(0, g.target_amount - g.saved_amount);

              return (
                <div
                  key={g.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    g.is_completed
                      ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-300 dark:border-emerald-700'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-xs">
                        {g.icon}
                      </div>

                      <div className="flex items-center space-x-1">
                        {g.is_completed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                            Achieved! 🎉
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-3 truncate">
                      {g.title}
                    </h4>

                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {formatCurrency(g.saved_amount)}
                      </span>
                      <span className="text-xs text-slate-400">
                        of {formatCurrency(g.target_amount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          g.is_completed
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-violet-600 to-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      <span>{pct}% Completed</span>
                      <span>
                        {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Goal Reached!'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setSelectedGoalId(g.id);
                        setIsDepositModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 font-bold text-xs border border-violet-200 dark:border-violet-800 transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Coins className="w-4 h-4" />
                      <span>+ Stash Cash Into Goal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Weekly Student Challenges */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <span>Active Student Challenges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c) => {
            const pct = Math.min(100, Math.round((c.current / c.target) * 100));

            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all ${
                  c.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  {c.completed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      +{c.reward_points} Pts
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    <span>Progress</span>
                    <span>
                      {c.current} / {c.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.completed ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Badges Showcase */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-indigo-500" />
          <span>Trophy Case & Badges</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-white dark:bg-slate-800 border-violet-200 dark:border-violet-800 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">{b.title}</h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{b.description}</p>
              {b.unlocked && (
                <span className="mt-2 inline-block text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive "Save ₹50/day" Simulator */}
      <DailySaverSimulator />

      {/* Modal: Create Goal */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-black text-xl text-slate-900 dark:text-white">
              Create New Savings Quest
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set a target for that gadget, vacation, or emergency cushion.
            </p>

            <form onSubmit={handleCreateGoal} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro M3, Goa Trip"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="20000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Already Saved So Far (Optional)
                </label>
                <input
                  type="number"
                  value={newInitialSaved}
                  onChange={(e) => setNewInitialSaved(e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Pick an Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {goalIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                        newIcon === ic
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950 scale-110 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/25"
                >
                  {isSubmitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deposit into Goal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-black text-xl text-slate-900 dark:text-white">
              Stash Cash into Goal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every ₹50 or ₹100 brings you closer to your milestone.
            </p>

            <form onSubmit={handleDeposit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Deposit Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    autoFocus
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash (Piggy Bank / Locker)</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !depositAmount}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/25"
                >
                  {isSubmitting ? 'Stashing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
