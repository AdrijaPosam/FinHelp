import confetti from 'canvas-confetti';

export function formatCurrency(amount: number | null | undefined, currency: string = '₹'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });
  return amount < 0 ? `-${currency}${formatted}` : `${currency}${formatted}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dt = new Date(year, month, day);
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export interface CategoryMeta {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const CATEGORY_METAS: Record<string, CategoryMeta> = {
  'Food & Canteen': {
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: '☕'
  },
  'Transit & Travel': {
    color: 'text-sky-700 dark:text-sky-300',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-200 dark:border-sky-800',
    icon: '🚇'
  },
  'Shopping & Clothes': {
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: '🛍️'
  },
  'College & Books': {
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '📚'
  },
  'Hangouts & Fun': {
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    icon: '🎉'
  },
  'Subscriptions & Tech': {
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    icon: '💻'
  },
  'Personal Care': {
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40',
    borderColor: 'border-teal-200 dark:border-teal-800',
    icon: '🧴'
  },
  'Gifts & Pocket Money': {
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: '🎁'
  },
  'Other': {
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-300 dark:border-slate-700',
    icon: '🔖'
  }
};

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_METAS[category] || CATEGORY_METAS['Other'];
}

export function triggerGoalCelebration() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6']
  });
}
