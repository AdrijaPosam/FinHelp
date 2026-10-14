import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  ShieldCheck,
  Trophy,
  Bot,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    seedDemoData,
    resetAllData,
    summary
  } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Expenses', icon: ReceiptText },
    { id: 'planner', label: 'Smart Planner', icon: PieChart },
    { id: 'reality-check', label: 'Reality Check', icon: ShieldCheck, badge: 'AI' },
    { id: 'quest', label: 'Savings Quest', icon: Trophy },
    { id: 'chat', label: 'Ask Finny', icon: Bot, badge: 'AI' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-violet-500/20 text-white font-black text-xl">
              F
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Fin<span className="text-violet-600 dark:text-violet-400">Help</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  STUDENT AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Spend mindfully. Save happily.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600 dark:text-violet-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-violet-200 text-violet-900 dark:bg-violet-900 dark:text-violet-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Quick Demo Seed Button */}
            <button
              onClick={seedDemoData}
              title="Load realistic Indian student demo expenses & goals"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Load Demo Data</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo and user transactions? This will give you a fresh clean slate.')) {
                  resetAllData();
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Reset All Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 space-x-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
