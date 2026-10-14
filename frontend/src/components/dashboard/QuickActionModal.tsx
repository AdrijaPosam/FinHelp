import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'expense' | 'income' | 'savings_deposit';
}

const CATEGORIES = [
  'Food & Canteen',
  'Transit & Travel',
  'Shopping & Clothes',
  'College & Books',
  'Hangouts & Fun',
  'Subscriptions & Tech',
  'Personal Care',
  'Gifts & Pocket Money',
  'Other'
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Net Banking'];

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense'
}) => {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<'expense' | 'income' | 'savings_deposit'>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Canteen');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    try {
      setIsSubmitting(true);
      await addTransaction({
        type,
        amount: numAmount,
        category,
        payment_method: paymentMethod,
        note: note.trim() || undefined,
        date
      });
      // Reset form
      setAmount('');
      setNote('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Record Transaction</h3>
              <p className="text-xs text-slate-400">Keep your pocket money balance up to date</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('savings_deposit')}
              className={`py-2 rounded-lg transition-all ${
                type === 'savings_deposit'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Saved
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="150"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xl font-bold focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category */}
          {type === 'expense' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Canteen thali, Tapri chai, Metro pass"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
