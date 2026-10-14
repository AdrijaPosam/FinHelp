import {
  UserProfile,
  Transaction,
  DashboardSummary,
  BudgetCategory,
  SavingsGoal,
  WishlistItem,
  Challenge,
  Badge,
  PurchaseRealityCheckResult,
  FinnyMessage
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `Request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Profile
  getProfile: () => request<UserProfile>('/profile'),
  updateProfile: (data: Partial<UserProfile>) =>
    request<UserProfile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  seedDemoData: () => request<UserProfile>('/profile/seed-demo', { method: 'POST' }),
  resetData: () => request<{ message: string; profile: UserProfile }>('/profile/reset', { method: 'POST' }),
  getSummary: () => request<DashboardSummary>('/profile/summary'),

  // Transactions
  getTransactions: (params?: { category?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.type && params.type !== 'All') query.append('type', params.type);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return request<Transaction[]>(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  createTransaction: (data: {
    type: string;
    amount: number;
    category: string;
    payment_method: string;
    note?: string;
    date: string;
  }) => request<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id: number, data: Partial<Transaction>) =>
    request<Transaction>(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id: number) =>
    request<{ message: string; id: number }>(`/transactions/${id}`, { method: 'DELETE' }),
  getExportCsvUrl: () => `${API_BASE}/transactions/export/csv`,

  // Budget
  getBudgets: () => request<BudgetCategory[]>('/budget'),
  saveBudgets: (budgets: { category: string; allocated_amount: number }[]) =>
    request<BudgetCategory[]>('/budget/batch', {
      method: 'POST',
      body: JSON.stringify({ budgets })
    }),
  getSmartBudgetPlan: () => request<any>('/budget/planner'),

  // AI & Mindful features
  checkPurchaseReality: (data: {
    item_name: string;
    price: number;
    category: string;
    classification: string;
    reason?: string;
  }) =>
    request<PurchaseRealityCheckResult>('/ai/purchase-reality-check', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  askFinnyChat: (message: string, history: FinnyMessage[]) =>
    request<{ reply: string; quick_suggestions: string[]; source: 'gemini' | 'smart_advisor' }>(
      '/ai/finny-chat',
      {
        method: 'POST',
        body: JSON.stringify({ message, history })
      }
    ),
  getMonthlyInsight: () =>
    request<{ headline: string; summary: string; tips: string[]; source: string }>(
      '/ai/monthly-insight'
    ),

  // Gamification: Goals, Wishlist, Challenges, Badges
  getSavingsGoals: () => request<SavingsGoal[]>('/gamification/goals'),
  createSavingsGoal: (data: {
    title: string;
    target_amount: number;
    saved_amount?: number;
    target_date?: string;
    icon?: string;
  }) => request<SavingsGoal>('/gamification/goals', { method: 'POST', body: JSON.stringify(data) }),
  depositToSavingsGoal: (
    goalId: number,
    amount: number,
    payment_method: string = 'UPI',
    note?: string
  ) =>
    request<SavingsGoal>(`/gamification/goals/${goalId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount, payment_method, note })
    }),
  deleteSavingsGoal: (goalId: number) =>
    request<{ message: string; id: number }>(`/gamification/goals/${goalId}`, { method: 'DELETE' }),

  getWishlist: () => request<WishlistItem[]>('/gamification/wishlist'),
  addToWishlist: (data: {
    item_name: string;
    price: number;
    category: string;
    classification: string;
    reason?: string;
    review_date: string;
  }) => request<WishlistItem>('/gamification/wishlist', { method: 'POST', body: JSON.stringify(data) }),
  updateWishlistStatus: (id: number, status: 'cooling' | 'bought' | 'skipped') =>
    request<WishlistItem>(`/gamification/wishlist/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteWishlistItem: (id: number) =>
    request<{ message: string; id: number }>(`/gamification/wishlist/${id}`, { method: 'DELETE' }),

  getChallenges: () => request<Challenge[]>('/gamification/challenges'),
  getBadges: () => request<Badge[]>('/gamification/badges')
};
