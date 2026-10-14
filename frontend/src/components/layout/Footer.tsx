import React from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-800 dark:text-slate-200">FinHelp</span>
          <span>•</span>
          <span>Spend mindfully. Save happily.</span>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-center space-x-4 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Private & Local (No Bank Credentials Needed)</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for College Students</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
