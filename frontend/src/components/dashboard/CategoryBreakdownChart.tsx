import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdown } from '../../types';
import { formatCurrency, getCategoryMeta } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdown[];
  totalExpenses: number;
}

const PALETTE = [
  '#8B5CF6', // Lavender/Purple
  '#10B981', // Mint Green
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#6366F1'  // Indigo
];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categories,
  totalExpenses
}) => {
  const activeCategories = categories.filter((c) => c.spent > 0);

  if (activeCategories.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center text-center h-80">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No expenses logged yet</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Record your first chai, metro ticket, or snacks to see your spending breakdown here!
        </p>
      </div>
    );
  }

  const chartData = activeCategories.map((c) => ({
    name: c.category,
    value: c.spent,
    percentage: c.percentage
  }));

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Spending by Category
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Where your pocket money went this month</p>
        </div>
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-800">
          Total: {formatCurrency(totalExpenses)}
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), 'Spent']}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        {activeCategories.slice(0, 6).map((c, i) => {
          const meta = getCategoryMeta(c.category);
          return (
            <div
              key={c.category}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-xs"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {meta.icon} {c.category}
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-1">
                {c.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
