from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# --- User Profile Schemas ---
class UserProfileBase(BaseModel):
    name: str = "Student"
    monthly_pocket_money: float = Field(default=6000.0, ge=0)
    existing_savings: float = Field(default=1500.0, ge=0)
    fixed_expenses: float = Field(default=1200.0, ge=0)
    savings_goal_name: str = "Emergency & Fun Fund"
    savings_goal_target: float = Field(default=10000.0, ge=0)
    saving_style: str = "balanced"  # relaxed, balanced, aggressive
    currency: str = "₹"
    onboarding_completed: bool = False

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    monthly_pocket_money: Optional[float] = None
    existing_savings: Optional[float] = None
    fixed_expenses: Optional[float] = None
    savings_goal_name: Optional[str] = None
    savings_goal_target: Optional[float] = None
    saving_style: Optional[str] = None
    currency: Optional[str] = None
    onboarding_completed: Optional[bool] = None

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Transaction Schemas ---
class TransactionBase(BaseModel):
    type: str = "expense"  # 'expense', 'income', 'savings_deposit'
    amount: float = Field(..., gt=0)
    category: str = "Food & Canteen"
    payment_method: str = "UPI"
    note: Optional[str] = None
    date: str  # YYYY-MM-DD

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    payment_method: Optional[str] = None
    note: Optional[str] = None
    date: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Budget Category Schemas ---
class BudgetCategoryItem(BaseModel):
    category: str
    allocated_amount: float = Field(default=0.0, ge=0)

class BudgetUpdateList(BaseModel):
    budgets: List[BudgetCategoryItem]

class BudgetCategoryResponse(BudgetCategoryItem):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# --- Savings Goal Schemas ---
class SavingsGoalBase(BaseModel):
    title: str
    target_amount: float = Field(..., gt=0)
    saved_amount: float = Field(default=0.0, ge=0)
    target_date: Optional[str] = None
    icon: str = "🎯"
    is_completed: bool = False

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalDeposit(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method: str = "UPI"
    note: Optional[str] = "Contribution to savings goal"

class SavingsGoalResponse(SavingsGoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Wishlist Schemas ---
class WishlistItemBase(BaseModel):
    item_name: str
    price: float = Field(..., gt=0)
    category: str = "Shopping & Clothes"
    classification: str = "want"  # 'need', 'want', 'unsure'
    reason: Optional[str] = None
    review_date: str
    status: str = "cooling"  # 'cooling', 'bought', 'skipped'

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItemResponse(WishlistItemBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- AI Endpoints Schemas ---
class PurchaseCheckRequest(BaseModel):
    item_name: str
    price: float = Field(..., gt=0)
    category: str = "Shopping & Clothes"
    classification: str = "want"  # 'need', 'want', 'unsure'
    reason: Optional[str] = None

class PurchaseCheckResponse(BaseModel):
    item_name: str
    price: float
    category: str
    classification: str
    verdict: str
    verdict_title: str
    status_code: str
    remaining_before: float
    remaining_after: float
    budget_impact_percent: float
    daily_budget_equivalent: float
    should_cool_off: bool
    recommended_cool_off_days: int
    advice: str
    reflection_question: str
    ai_enhanced_thought: Optional[str] = None
    source: str = "smart_advisor"  # 'gemini' or 'smart_advisor'

class FinnyChatMessage(BaseModel):
    role: str
    content: str

class FinnyChatRequest(BaseModel):
    message: str
    history: List[FinnyChatMessage] = []

class FinnyChatResponse(BaseModel):
    reply: str
    quick_suggestions: List[str] = []
    source: str = "smart_advisor"

class MonthlyInsightResponse(BaseModel):
    headline: str
    summary: str
    tips: List[str]
    source: str
