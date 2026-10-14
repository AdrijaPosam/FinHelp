export interface UserProfile {
  id: number;
  name: string;
  monthly_pocket_money: number;
  existing_savings: number;
  fixed_expenses: number;
  savings_goal_name: string;
  savings_goal_target: number;
  saving_style: 'relaxed' | 'balanced' | 'aggressive' | string;
  currency: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'expense' | 'income' | 'savings_deposit';

export interface Transaction {
  id: number;
  user_id: number;
  type: TransactionType;
  amount: number;
  category: string;
  payment_method: string;
  note?: string;
  date: string;
  created_at: string;
}

export interface CategoryBreakdown {
  category: string;
  spent: number;
  allocated: number;
  percentage: number;
  status: 'normal' | 'warning' | 'exceeded';
}

export interface WeeklySpending {
  week: string;
  amount: number;
}

export interface SpendingPersonality {
  title: string;
  tagline: string;
  badge_icon: string;
  reason: string;
}

export interface DashboardSummary {
  pocket_money: number;
  additional_income: number;
  total_monthly_inflow: number;
  fixed_expenses: number;
  flexible_spending_allowance: number;
  total_expenses: number;
  total_savings_deposits: number;
  existing_savings: number;
  total_current_savings: number;
  remaining_safe_spend: number;
  safe_daily_spend: number;
  safe_weekly_spend: number;
  days_left: number;
  total_days: number;
  current_day: number;
  spending_pace_status: 'healthy' | 'caution' | 'overspending';
  pace_message: string;
  spend_percentage: number;
  category_breakdown: CategoryBreakdown[];
  weekly_spending: WeeklySpending[];
  personality: SpendingPersonality;
  user_name: string;
  savings_goal_name: string;
  savings_goal_target: number;
  saving_style: string;
  currency: string;
  onboarding_completed: boolean;
}

export interface BudgetCategory {
  id?: number;
  user_id?: number;
  category: string;
  allocated_amount: number;
}

export interface SavingsGoal {
  id: number;
  user_id: number;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  icon: string;
  is_completed: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  item_name: string;
  price: number;
  category: string;
  classification: 'need' | 'want' | 'unsure';
  reason?: string;
  review_date: string;
  status: 'cooling' | 'bought' | 'skipped';
  created_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  reward_points: number;
  badge_name: string;
  icon: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface PurchaseRealityCheckResult {
  item_name: string;
  price: number;
  category: string;
  classification: string;
  verdict: 'safe' | 'warning' | 'danger';
  verdict_title: string;
  status_code: string;
  remaining_before: number;
  remaining_after: number;
  budget_impact_percent: number;
  daily_budget_equivalent: number;
  should_cool_off: boolean;
  recommended_cool_off_days: number;
  advice: string;
  reflection_question: string;
  ai_enhanced_thought?: string;
  source: 'gemini' | 'smart_advisor';
}

export interface FinnyMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}
