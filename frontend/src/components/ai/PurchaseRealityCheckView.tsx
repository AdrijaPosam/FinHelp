import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';
import { PurchaseRealityCheckResult } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  ShieldCheck,
  Sparkles,
  Clock,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookmarkCheck,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { CoolingOffWishlistView } from './CoolingOffWishlistView';

export const PurchaseRealityCheckView: React.FC = () => {
  const { summary, addToWishlist, setToastMessage } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<'check' | 'wishlist'>('check');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Shopping & Clothes');
  const [classification, setClassification] = useState<'need' | 'want' | 'unsure'>('want');
  const [reason, setReason] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<PurchaseRealityCheckResult | null>(null);

  const categories = [
    'Shopping & Clothes',
    'Food & Canteen',
    'Transit & Travel',
    'College & Books',
    'Hangouts & Fun',
    'Subscriptions & Tech',
    'Personal Care',
    'Other'
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!numPrice || numPrice <= 0 || !itemName) return;

    try {
      setIsChecking(true);
      const evalRes = await api.checkPurchaseReality({
        item_name: itemName.trim(),
        price: numPrice,
        category,
        classification,
        reason: reason.trim() || undefined
      });
      setResult(evalRes);
    } catch (err: any) {
      console.error(err);
      setToastMessage('Failed to evaluate purchase. Ensure backend is running.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveToWishlist = async () => {
    if (!result) return;
    const days = result.recommended_cool_off_days || 2;
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + days);

    try {
      await addToWishlist({
        item_name: result.item_name,
        price: result.price,
        category: result.category,
        classification: result.classification as any,
        reason: reason || undefined,
        review_date: reviewDate.toISOString().split('T')[0]
      });
      setActiveSubTab('wishlist');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Signature AI Tool
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            AI Purchase Reality Check
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test impulsive purchases before tapping UPI. Never feel shamed — just spend with clarity.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('check')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'check'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reality Check Form
          </button>
          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'wishlist'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cooling-Off Wishlist
          </button>
        </div>
      </div>

      {activeSubTab === 'wishlist' ? (
        <CoolingOffWishlistView onBack={() => setActiveSubTab('check')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleEvaluate}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <span>What are you thinking of buying?</span>
              </h3>

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Item or Experience Name
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Graphic Hoodie, Gaming Mouse, Swiggy Pizza"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Classification: Need, Want, Unsure */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Honest Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'need', label: 'Essential Need', desc: 'Books, medicine, repairs' },
                    { id: 'want', label: 'Fun / Want', desc: 'Gadgets, fashion, outings' },
                    { id: 'unsure', label: 'Uncertain', desc: 'Impulse temptation' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClassification(c.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        classification === c.id
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{c.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Justification / Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Why do you want it? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Friends are all buying it, or needed for semester presentation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isChecking || !itemName || !price}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isChecking ? 'Running Reality Check...' : 'Run Reality Check'}</span>
              </button>
            </form>
          </div>

          {/* Reality Check Analysis Output Column */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6">
                {/* Main Verdict Card */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border shadow-lg transition-all ${
                    result.verdict === 'danger'
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                      : result.verdict === 'warning'
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                      : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          result.verdict === 'danger'
                            ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                            : result.verdict === 'warning'
                            ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                        }`}
                      >
                        {result.verdict_title}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                        {result.item_name} — {formatCurrency(result.price)}
                      </h3>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md">
                      {result.verdict === 'danger' ? (
                        <XCircle className="w-8 h-8 text-rose-500" />
                      ) : result.verdict === 'warning' ? (
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Left After Purchase
                      </span>
                      <p
                        className={`text-base font-black mt-0.5 ${
                          result.remaining_after < 0
                            ? 'text-rose-600'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {formatCurrency(result.remaining_after)}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Daily Budget Consumed
                      </span>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                        {result.daily_budget_equivalent} Days
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Budget Impact
                      </span>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                        {result.budget_impact_percent}% of Cash
                      </p>
                    </div>
                  </div>

                  {/* AI Thought Callout */}
                  <div className="mt-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>Finny's Mindful Buddy Thought:</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        ({result.source === 'gemini' ? 'Gemini AI' : 'Smart Advisor'})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-2 font-medium leading-relaxed">
                      "{result.ai_enhanced_thought || result.advice}"
                    </p>
                  </div>

                  {/* Reflection Question */}
                  <div className="mt-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40">
                    <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      <HelpCircle className="w-4 h-4" />
                      <span>One Reflection Question Before You Buy:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 mt-1 italic font-medium">
                      "{result.reflection_question}"
                    </p>
                  </div>

                  {/* Wishlist / Cooling-Off Action */}
                  <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recommended Pause:{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {result.recommended_cool_off_days} Days Cooling-Off
                      </span>
                    </p>

                    <button
                      onClick={handleSaveToWishlist}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Put in Cooling-Off Wishlist</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Placeholder */
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enter an item on the left
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  Finny will analyze your remaining safe spend, daily allowance equivalent, and
                  suggest a cooling-off period to prevent buyer's remorse.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
