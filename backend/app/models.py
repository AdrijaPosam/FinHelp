from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Student")
    monthly_pocket_money = Column(Float, default=6000.0)
    existing_savings = Column(Float, default=1500.0)
    fixed_expenses = Column(Float, default=1200.0)  # PG/Rent, Phone, Metro pass, Subscriptions
    savings_goal_name = Column(String(150), default="Emergency & Fun Fund")
    savings_goal_target = Column(Float, default=10000.0)
    saving_style = Column(String(50), default="balanced")  # relaxed (10%), balanced (20%), aggressive (30%)
    currency = Column(String(10), default="₹")
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("BudgetCategory", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("SavingsGoal", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    type = Column(String(20), nullable=False)  # 'expense', 'income', 'savings_deposit'
    amount = Column(Float, nullable=False)
    category = Column(String(80), nullable=False)  # Food, Travel, Shopping, College, etc.
    payment_method = Column(String(40), default="UPI")  # UPI, Cash, Card, Net Banking
    note = Column(String(255), nullable=True)
    date = Column(String(10), nullable=False)  # 'YYYY-MM-DD'
    created_at = Column(DateTime, default=utc_now)

    user = relationship("UserProfile", back_populates="transactions")


class BudgetCategory(Base):
    __tablename__ = "budget_categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    category = Column(String(80), nullable=False)
    allocated_amount = Column(Float, default=0.0)

    user = relationship("UserProfile", back_populates="budgets")


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    title = Column(String(150), nullable=False)
    target_amount = Column(Float, nullable=False)
    saved_amount = Column(Float, default=0.0)
    target_date = Column(String(10), nullable=True)  # 'YYYY-MM-DD'
    icon = Column(String(30), default="🎯")
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("UserProfile", back_populates="goals")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    item_name = Column(String(150), nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(80), default="Shopping")
    classification = Column(String(20), default="want")  # 'need', 'want', 'unsure'
    reason = Column(String(255), nullable=True)
    review_date = Column(String(10), nullable=False)  # Date after cooling-off period
    status = Column(String(20), default="cooling")  # 'cooling', 'bought', 'skipped'
    created_at = Column(DateTime, default=utc_now)

    user = relationship("UserProfile", back_populates="wishlist_items")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user', 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("UserProfile", back_populates="chat_messages")
