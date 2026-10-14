import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Target, Shield, HelpCircle, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, setActiveTab, setToastMessage } = useFinance();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile?.name || 'Aarav',
    monthly_pocket_money: profile?.monthly_pocket_money || 6000,
    existing_savings: profile?.existing_savings || 1000,
    fixed_expenses: profile?.fixed_expenses || 1200,
    savings_goal_name: profile?.savings_goal_name || 'Emergency & Gadget Fund',
    savings_goal_target: profile?.savings_goal_target || 10000,
    saving_style: profile?.saving_style || 'balanced'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile({
        ...formData,
        onboarding_completed: true
      });

      // Also create their initial savings goal in the database if it doesn't already exist
      try {
        await api.createSavingsGoal({
          title: formData.savings_goal_name,
          target_amount: formData.savings_goal_target,
          saved_amount: formData.existing_savings,
          icon: '🎯'
        });
      } catch {
        // Goal creation can fail if duplicate, ignore gracefully
      }

      setToastMessage(`Welcome aboard, ${formData.name}! Your budget is ready.`);
      onClose();
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header with Step indicator */}
        <div className="p-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              <span className="font-extrabold text-sm uppercase tracking-wider text-white/90">
                FinHelp Setup ({step} of 3)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-black mt-2 text-white">
            {step === 1 && "Let's Get to Know You!"}
            {step === 2 && 'Your Pocket Money & Fixed Bills'}
            {step === 3 && 'Your Savings Style & Goals'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {step === 1 && 'Personalize your campus finance buddy experience.'}
            {step === 2 && 'We separate fixed necessities from flexible everyday spending.'}
            {step === 3 && 'Tailor your savings without unrealistic or rigid restrictions.'}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  What should Finny call you?
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav, Priya, Sid"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Monthly Pocket Money or Inflow (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthly_pocket_money}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_pocket_money: Math.max(0, parseFloat(e.target.value) || 0)
                    })
                  }
                  placeholder="6000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Allowance from parents, stipend, or freelance cash you receive each month.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Existing Savings / Bank Balance (Optional)
                </label>
                <input
                  type="number"
                  value={formData.existing_savings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existing_savings: Math.max(0, parseFloat(e.target.value) || 0)
                    })
                  }
                  placeholder="1000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Any emergency cushion or cash you already have saved up.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Expected Fixed Monthly Expenses (₹)
                </label>
                <input
                  type="number"
                  value={formData.fixed_expenses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixed_expenses: Math.max(0, parseFloat(e.target.value) || 0)
                    })
                  }
                  placeholder="1200"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Non-negotiable monthly payments: Metro/Bus monthly pass, mobile recharge, hostel WiFi, or subscriptions.
                </p>
              </div>

              {/* Calculated Discretionary preview */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Flexible Discretionary Pool:</span>
                  <span className="text-lg font-black">
                    ₹{Math.max(0, formData.monthly_pocket_money - formData.fixed_expenses).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  This is the money left over for canteen meals, hangouts, books, and savings!
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  What are you saving for?
                </label>
                <input
                  type="text"
                  value={formData.savings_goal_name}
                  onChange={(e) => setFormData({ ...formData, savings_goal_name: e.target.value })}
                  placeholder="e.g. New Laptop Fund, Goa Trip, Headphones"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Target Amount for Goal (₹)
                </label>
                <input
                  type="number"
                  value={formData.savings_goal_target}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      savings_goal_target: Math.max(0, parseFloat(e.target.value) || 0)
                    })
                  }
                  placeholder="15000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Your Preferred Saving Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relaxed', label: 'Relaxed', pct: '10%', desc: 'More fun cash' },
                    { id: 'balanced', label: 'Balanced', pct: '20%', desc: 'Recommended' },
                    { id: 'aggressive', label: 'Focused', pct: '30%', desc: 'Fast savings' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, saving_style: s.id })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        formData.saving_style === s.id
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-sm font-extrabold text-violet-600 dark:text-violet-400 mt-0.5">
                        {s.pct}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              <span>{step === 3 ? (isSubmitting ? 'Creating Budget...' : 'Finish & Open FinHelp') : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
