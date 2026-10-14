import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  DashboardSummary,
  Transaction,
  SavingsGoal,
  WishlistItem,
  Challenge,
  Badge
} from '../types';
import { api } from '../services/api';
import { triggerGoalCelebration } from '../utils/formatters';

interface FinanceContextType {
  profile: UserProfile | null;
  summary: DashboardSummary | null;
  transactions: Transaction[];
  goals: SavingsGoal[];
  wishlist: WishlistItem[];
  challenges: Challenge[];
  badges: Badge[];
  isLoading: boolean;
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  refreshAll: () => Promise<void>;
  addTransaction: (tx: {
    type: string;
    amount: number;
    category: string;
    payment_method: string;
    note?: string;
    date: string;
  }) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  seedDemoData: () => Promise<void>;
  resetAllData: () => Promise<void>;
  depositToGoal: (goalId: number, amount: number, method?: string, note?: string) => Promise<void>;
  addToWishlist: (data: {
    item_name: string;
    price: number;
    category: string;
    classification: string;
    reason?: string;
    review_date: string;
  }) => Promise<void>;
  updateWishlistStatus: (id: number, status: 'cooling' | 'bought' | 'skipped') => Promise<void>;
  deleteWishlistItem: (id: number) => Promise<void>;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('finhelp_theme') === 'dark';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string | null) => {
    setToastMessage(msg);
    if (msg) {
      setTimeout(() => {
        setToastMessage((prev) => (prev === msg ? null : prev));
      }, 3500);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('finhelp_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const refreshAll = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profData, sumData, txData, goalsData, wishData, chalData, badgeData] =
        await Promise.all([
          api.getProfile(),
          api.getSummary(),
          api.getTransactions(),
          api.getSavingsGoals(),
          api.getWishlist(),
          api.getChallenges(),
          api.getBadges()
        ]);

      setProfile(profData);
      setSummary(sumData);
      setTransactions(txData);
      setGoals(goalsData);
      setWishlist(wishData);
      setChallenges(chalData);
      setBadges(badgeData);

      // If user hasn't completed onboarding and has no transactions, start at landing or onboarding
      if (!profData.onboarding_completed && txData.length === 0) {
        setActiveTab('landing');
      }
    } catch (err: any) {
      console.error('Failed to load financial records:', err);
      showToast('Could not reach FinHelp API server. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const addTransaction = async (txData: {
    type: string;
    amount: number;
    category: string;
    payment_method: string;
    note?: string;
    date: string;
  }) => {
    try {
      await api.createTransaction(txData);
      showToast(`Logged ₹${txData.amount} (${txData.category})`);
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to save transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await api.deleteTransaction(id);
      showToast('Transaction removed');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to delete transaction');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      await api.updateProfile(data);
      showToast('Profile and budget updated!');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to update profile');
      throw err;
    }
  };

  const seedDemoData = async () => {
    try {
      setIsLoading(true);
      await api.seedDemoData();
      await refreshAll();
      setActiveTab('dashboard');
      showToast('Loaded realistic student demo data! Enjoy exploring.');
      triggerGoalCelebration();
    } catch (err: any) {
      showToast('Failed to seed demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAllData = async () => {
    try {
      setIsLoading(true);
      await api.resetData();
      await refreshAll();
      setActiveTab('landing');
      showToast('Reset complete. Ready for fresh records.');
    } catch (err: any) {
      showToast('Failed to reset data');
    } finally {
      setIsLoading(false);
    }
  };

  const depositToGoal = async (
    goalId: number,
    amount: number,
    method: string = 'UPI',
    note?: string
  ) => {
    try {
      const updated = await api.depositToSavingsGoal(goalId, amount, method, note);
      showToast(`Stashed ₹${amount} into "${updated.title}"! 🚀`);
      if (updated.is_completed) {
        triggerGoalCelebration();
      }
      await refreshAll();
    } catch (err: any) {
      showToast('Deposit failed');
      throw err;
    }
  };

  const addToWishlist = async (data: {
    item_name: string;
    price: number;
    category: string;
    classification: string;
    reason?: string;
    review_date: string;
  }) => {
    try {
      await api.addToWishlist(data);
      showToast(`Added "${data.item_name}" to Cooling-off Wishlist! 🧘`);
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to add to wishlist');
      throw err;
    }
  };

  const updateWishlistStatus = async (id: number, status: 'cooling' | 'bought' | 'skipped') => {
    try {
      await api.updateWishlistStatus(id, status);
      if (status === 'skipped') {
        showToast('Awesome self-control! Money kept safe in your wallet 🛡️');
        triggerGoalCelebration();
      } else if (status === 'bought') {
        showToast('Marked as bought! Remember to log it in your tracker.');
      }
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to update wishlist status');
      throw err;
    }
  };

  const deleteWishlistItem = async (id: number) => {
    try {
      await api.deleteWishlistItem(id);
      showToast('Item removed from wishlist');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to remove item');
      throw err;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        profile,
        summary,
        transactions,
        goals,
        wishlist,
        challenges,
        badges,
        isLoading,
        isDarkMode,
        activeTab,
        setActiveTab,
        toggleDarkMode,
        refreshAll,
        addTransaction,
        deleteTransaction,
        updateProfile,
        seedDemoData,
        resetAllData,
        depositToGoal,
        addToWishlist,
        updateWishlistStatus,
        deleteWishlistItem,
        toastMessage,
        setToastMessage: showToast
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
