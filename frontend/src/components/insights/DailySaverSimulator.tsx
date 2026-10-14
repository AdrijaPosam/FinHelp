import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Calculator, Sparkles, Coffee, Laptop, GraduationCap } from 'lucide-react';

export const DailySaverSimulator: React.FC = () => {
  const [dailyAmount, setDailyAmount] = useState(50);

  const oneMonth = dailyAmount * 30;
  const sixMonths = dailyAmount * 180;
  const oneYear = dailyAmount * 365;
  const graduation = dailyAmount * 365 * 3;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-emerald-600 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-white/20 text-white">
              <Calculator className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-white/80">
              Student Power Tool
            </span>
          </div>
          <h3 className="text-2xl font-black mt-1">
            "What If I Save ₹{dailyAmount} a Day?" Simulator
          </h3>
          <p className="text-xs sm:text-sm text-white/80 mt-0.5">
            Skip just one extra cafe cold coffee, pack of chips, or auto ride.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
          <span className="text-xs text-white/80 block font-medium">Daily Savings</span>
          <span className="text-2xl font-black">₹{dailyAmount} / day</span>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-6">
        <input
          type="range"
          min="10"
          max="200"
          step="10"
          value={dailyAmount}
          onChange={(e) => setDailyAmount(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-300"
        />
        <div className="flex justify-between text-xs text-white/70 mt-1 font-semibold">
          <span>₹10 (Cutting Chai)</span>
          <span>₹50 (Cafe Snack)</span>
          <span>₹100 (Canteen Meal)</span>
          <span>₹200 (Online Delivery)</span>
        </div>
      </div>

      {/* 4 Compounding Milestone Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-xs text-white/70 font-semibold block">In 1 Month (30d)</span>
          <p className="text-xl sm:text-2xl font-black mt-1">{formatCurrency(oneMonth)}</p>
          <p className="text-[11px] text-white/80 mt-1">Covers semester reference books or wifi</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-xs text-white/70 font-semibold block">In 6 Months</span>
          <p className="text-xl sm:text-2xl font-black mt-1">{formatCurrency(sixMonths)}</p>
          <p className="text-[11px] text-white/80 mt-1">Covers noise-cancelling headphones</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-xs text-white/70 font-semibold block">In 1 Year (365d)</span>
          <p className="text-xl sm:text-2xl font-black mt-1">{formatCurrency(oneYear)}</p>
          <p className="text-[11px] text-white/80 mt-1">Covers college vacation or certification</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-amber-300/40">
          <div className="flex items-center space-x-1 text-amber-300 font-bold text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>By Graduation (3yr)</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-200 mt-1">
            {formatCurrency(graduation)}
          </p>
          <p className="text-[11px] text-white/90 mt-1 font-medium">
            Solid emergency fund & laptop budget!
          </p>
        </div>
      </div>
    </div>
  );
};
