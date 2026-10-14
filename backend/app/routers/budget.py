from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import BudgetCategory, UserProfile
from ..schemas import BudgetCategoryResponse, BudgetUpdateList
from ..calculations import STANDARD_CATEGORIES
from .profile import get_or_create_default_user

router = APIRouter(prefix="/budget", tags=["Budget"])

@router.get("", response_model=List[BudgetCategoryResponse])
def get_budgets(db: Session = Depends(get_db)):
    """Fetch current category budget allocations."""
    user = get_or_create_default_user(db)
    budgets = db.query(BudgetCategory).filter(BudgetCategory.user_id == user.id).all()
    
    # If no budgets set yet, return default empty allocations for standard categories
    if not budgets:
        results = []
        for cat in STANDARD_CATEGORIES:
            b = BudgetCategory(user_id=user.id, category=cat, allocated_amount=0.0)
            db.add(b)
            results.append(b)
        db.commit()
        for b in results:
            db.refresh(b)
        return results

    return budgets


@router.post("/batch", response_model=List[BudgetCategoryResponse])
def update_budget_batch(data: BudgetUpdateList, db: Session = Depends(get_db)):
    """Update or insert category allocations in batch."""
    user = get_or_create_default_user(db)
    
    # Map existing
    existing = {b.category: b for b in db.query(BudgetCategory).filter(BudgetCategory.user_id == user.id).all()}
    
    saved_items = []
    for item in data.budgets:
        if item.category in existing:
            b = existing[item.category]
            b.allocated_amount = round(item.allocated_amount, 2)
            saved_items.append(b)
        else:
            b = BudgetCategory(
                user_id=user.id,
                category=item.category,
                allocated_amount=round(item.allocated_amount, 2)
            )
            db.add(b)
            saved_items.append(b)

    db.commit()
    for b in saved_items:
        db.refresh(b)
    return saved_items


@router.get("/planner")
def get_smart_budget_plan(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Computes a personalized initial budget breakdown based on pocket money,
    fixed expenses, and saving style without forcing rigid limits.
    """
    user = get_or_create_default_user(db)
    pocket_money = max(0.0, user.monthly_pocket_money)
    fixed_exp = max(0.0, user.fixed_expenses)

    # Net pool for discretionary + savings
    discretionary_pool = max(0.0, pocket_money - fixed_exp)

    style = user.saving_style.lower() if user.saving_style else "balanced"
    if style == "aggressive":
        savings_ratio = 0.30
        savings_label = "Savings-Focused (30%)"
    elif style == "relaxed":
        savings_ratio = 0.10
        savings_label = "Relaxed Lifestyle (10%)"
    else:  # balanced
        savings_ratio = 0.20
        savings_label = "Balanced Student (20%)"

    recommended_savings = round(discretionary_pool * savings_ratio, 2)
    flexible_spend_pool = round(discretionary_pool - recommended_savings, 2)

    # Student category distributions of the flexible pool
    cat_weights = {
        "Food & Canteen": 0.35,
        "Transit & Travel": 0.15,
        "College & Books": 0.15,
        "Hangouts & Fun": 0.15,
        "Shopping & Clothes": 0.10,
        "Subscriptions & Tech": 0.05,
        "Personal Care": 0.05
    }

    suggested_categories = []
    for cat_name, weight in cat_weights.items():
        amount = round(flexible_spend_pool * weight, 2)
        suggested_categories.append({
            "category": cat_name,
            "weight_pct": int(weight * 100),
            "suggested_amount": amount
        })

    # Spending guidance
    safe_daily = round(flexible_spend_pool / 30, 2)
    safe_weekly = round(safe_daily * 7, 2)

    return {
        "monthly_pocket_money": pocket_money,
        "fixed_expenses": fixed_exp,
        "discretionary_pool": discretionary_pool,
        "saving_style": style,
        "saving_style_label": savings_label,
        "recommended_savings": recommended_savings,
        "flexible_spend_pool": flexible_spend_pool,
        "safe_daily_guidance": safe_daily,
        "safe_weekly_guidance": safe_weekly,
        "suggested_categories": suggested_categories,
        "rationale": (
            f"With ₹{pocket_money:.0f} pocket money and ₹{fixed_exp:.0f} committed to fixed essentials, "
            f"you have ₹{discretionary_pool:.0f} to divide. Setting aside ₹{recommended_savings:.0f} ({savings_label}) "
            f"leaves you a relaxed ₹{safe_daily:.0f} per day for canteen food, transit, and weekend fun."
        )
    }
