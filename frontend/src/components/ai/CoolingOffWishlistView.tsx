import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, triggerGoalCelebration } from '../../utils/formatters';
import { Clock, CheckCircle2, Shield, Trash2, ArrowLeft, Sparkles, SmilePlus } from 'lucide-react';

interface CoolingOffWishlistProps {
  onBack: () => void;
}

export const CoolingOffWishlistView: React.FC<CoolingOffWishlistProps> = ({ onBack }) => {
  const { wishlist, updateWishlistStatus, deleteWishlistItem } = useFinance();

  const coolingItems = wishlist.filter((item) => item.status === 'cooling');
  const skippedItems = wishlist.filter((item) => item.status === 'skipped');
  const boughtItems = wishlist.filter((item) => item.status === 'bought');

  const totalSavedBySkipping = skippedItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reality Check</span>
        </button>

        {totalSavedBySkipping > 0 && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-black flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Saved {formatCurrency(totalSavedBySkipping)} by Skipping Impulses!</span>
          </div>
        )}
      </div>

      {/* Explanation Banner */}
      <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-white">
            The 48-Hour Student Rule:
          </span>{' '}
          When you feel an intense urge to buy clothes or tech, wait 48 hours. If you still genuinely
          need it after cooling off, buy it guilt-free. If not, celebrate the cash you kept!
        </div>
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Active Cooling-Off Items ({coolingItems.length})</span>
        </h3>

        {coolingItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <SmilePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No items currently in cooling-off
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Whenever you run an AI Reality Check, click "Put in Cooling-off Wishlist" to park items here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coolingItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 uppercase">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                        {item.item_name}
                      </h4>
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {item.reason && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
                      "{item.reason}"
                    </p>
                  )}

                  <div className="mt-3 flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Review after: {formatDate(item.review_date)}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => updateWishlistStatus(item.id, 'skipped')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Skipped & Saved!</span>
                  </button>

                  <button
                    onClick={() => updateWishlistStatus(item.id, 'bought')}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Bought
                  </button>

                  <button
                    onClick={() => deleteWishlistItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skipped Items Shelf */}
        {skippedItems.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Impulses Successfully Resisted ({skippedItems.length})</span>
            </h4>
            <div className="space-y-2">
              {skippedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.item_name}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(item.price)} Kept
                    </span>
                    <button
                      onClick={() => deleteWishlistItem(item.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
