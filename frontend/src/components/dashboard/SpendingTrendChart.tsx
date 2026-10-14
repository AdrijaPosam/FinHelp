import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeeklySpending } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3 } from 'lucide-react';

interface SpendingTrendChartProps {
  data: WeeklySpending[];
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ data }) => {
  const hasData = data && data.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center text-center h-80">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No weekly spending yet</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          As you log transactions throughout the month, your weekly spending velocity will appear here!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Weekly Spending Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Pacing across weeks of the month</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(v) => `₹${v}`}
            />
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
            <Bar dataKey="amount" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
