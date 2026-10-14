import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Bot,
  PieChart,
  Coffee,
  CheckCircle2,
  Lock,
  Wallet
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

interface LandingPageProps {
  onStartOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding }) => {
  const { setActiveTab, seedDemoData } = useFinance();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-spin" />
            <span>AI-Powered Personal Finance for Indian College Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Spend mindfully. <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              Save happily.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The friendly financial companion designed for student pocket money. Say goodbye to
            end-of-month panic, impulse Swiggy buys, and mysterious empty bank accounts.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Managing My Money</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={seedDemoData}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Explore Instant Demo (Aarav's Data)</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Default Indian Rupees (₹)</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Campus Canteen & Transit Ready</span>
            </span>
            <span className="flex items-center space-x-1">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Zero Bank Login Required</span>
            </span>
          </div>
        </div>

        {/* Dashboard Visual Preview Card */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Interactive Student Preview
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Safe Daily Spending Engine
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Safe Daily Spend: ₹235 / day
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                    18 Days Remaining
                  </span>
                </div>
              </div>

              {/* Sample Metrics Mock */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Pocket Money</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹7,500</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">+₹1,700 Freelance</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Safe Spend</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹4,231</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">₹235/day safe pace</p>
                </div>
                <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved for Laptop Goal</p>
                  <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">₹6,000</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">30% of ₹20,000</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Spending Personality</p>
                  <p className="text-base font-bold text-amber-700 dark:text-amber-400 mt-1 flex items-center space-x-1">
                    <span>⚖️</span>
                    <span>Balanced Spender</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Even distribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Real College Life, Not Wall Street
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to take control of your pocket money with zero boring spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Purchase Reality Check */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xl mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Purchase Reality Check
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tempted by a ₹1,800 jacket or game? Finny calculates exactly how many days of canteen
              food and metro allowance it burns before you tap UPI.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center space-x-1">
              <span>Includes 48-Hour Cooling-Off Wishlist</span>
            </div>
          </div>

          {/* Card 2: Safe Daily Spend */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Safe Daily Spend Guidance
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Instead of guessing how much money is left, see one magic daily number: "You can safely
              spend ₹235 today." Pacing that protects your month-end.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span>Automatically updates after every expense</span>
            </div>
          </div>

          {/* Card 3: Savings Quest Gamification */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Gamified Savings Quests
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Level up your financial health! Complete challenges like "Save ₹100 this week" or "Skip
              1 Impulse Buy" to earn badges and hit goal milestones.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
              <span>Unlock badges & celebratory confetti</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="max-w-5xl mx-auto px-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How FinHelp Empowers You
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed to fit into 30 seconds of your daily campus routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Set Pocket Money</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your monthly allowance and expected fixed expenses like PG or metro pass.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Log Everyday Spends</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Quickly record tapri chai, college books, or UPI hangouts with one tap.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Reality Check</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Before buying that new gadget, get instant AI feedback and cooling-off timers.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">
              4
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Save Happily</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Watch your dream laptop or vacation fund grow steadily week after week.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Open Main Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
