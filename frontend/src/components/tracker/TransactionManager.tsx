import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, getCategoryMeta } from '../../utils/formatters';
import { api } from '../../services/api';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  Calendar,
  CreditCard,
  Tag,
  ArrowUpDown,
  Receipt
} from 'lucide-react';
import { QuickActionModal } from '../dashboard/QuickActionModal';

export const TransactionManager: React.FC = () => {
  const { transactions, deleteTransaction, summary } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const categories = [
    'All',
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !searchTerm ||
        (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.payment_method.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || tx.category === selectedCategory;

      const matchesType =
        selectedType === 'All' || tx.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setDeletingId(id);
        await deleteTransaction(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(), '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Expense & Income Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, filter, and export all your college transactions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Quick Pills */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Inflow</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(summary.total_monthly_inflow)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Spent</span>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {formatCurrency(summary.total_expenses)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Saved</span>
            <p className="text-lg font-black text-sky-600 dark:text-sky-400 mt-0.5">
              {formatCurrency(summary.total_current_savings)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Safe Remaining</span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(summary.remaining_safe_spend)}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, canteen, UPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Incomes Only</option>
            <option value="savings_deposit">Savings Deposits</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              No matching transactions found
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search or category filters, or click "Add Transaction" to log an item.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTransactions.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              const isIncome = tx.type === 'income';
              const isSaved = tx.type === 'savings_deposit';

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isSaved
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : meta.bgColor + ' ' + meta.color
                      }`}
                    >
                      {isIncome ? '💰' : isSaved ? '🎯' : meta.icon}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {tx.note || tx.category}
                        </p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {tx.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(tx.date)}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <CreditCard className="w-3 h-3" />
                          <span>{tx.payment_method}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 ml-4">
                    <div className="text-right">
                      <p
                        className={`text-base sm:text-lg font-black ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isSaved
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? '+' : isSaved ? 'Saved ' : '-'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {tx.type.replace('_', ' ')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <QuickActionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="expense"
      />
    </div>
  );
};
