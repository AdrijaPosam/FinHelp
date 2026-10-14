import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: 'violet' | 'emerald' | 'sky' | 'amber' | 'rose';
  onClick?: () => void;
}

const colorMaps = {
  violet: {
    bg: 'bg-violet-50/70 dark:bg-violet-950/30',
    border: 'border-violet-100 dark:border-violet-900/60',
    text: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/60'
  },
  emerald: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    border: 'border-emerald-100 dark:border-emerald-900/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60'
  },
  sky: {
    bg: 'bg-sky-50/70 dark:bg-sky-950/30',
    border: 'border-sky-100 dark:border-sky-900/60',
    text: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-100 dark:bg-sky-900/60'
  },
  amber: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/30',
    border: 'border-amber-100 dark:border-amber-900/60',
    text: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/60'
  },
  rose: {
    bg: 'bg-rose-50/70 dark:bg-rose-950/30',
    border: 'border-rose-100 dark:border-rose-900/60',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/60'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  onClick
}) => {
  const styles = colorMaps[colorScheme] || colorMaps.violet;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border ${styles.border} ${styles.bg} transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <div className={`p-2 rounded-xl ${styles.iconBg} ${styles.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};
