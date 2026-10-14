from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from ..database import get_db
from ..models import UserProfile, Transaction, BudgetCategory
from ..schemas import UserProfileResponse, UserProfileUpdate
from ..calculations import compute_month_summary
from ..seed_data import seed_student_demo_data

router = APIRouter(prefix="/profile", tags=["Profile"])

def get_or_create_default_user(db: Session) -> UserProfile:
    user = db.query(UserProfile).first()
    if not user:
        user = UserProfile(
            name="College Student",
            monthly_pocket_money=6000.0,
            existing_savings=1500.0,
            fixed_expenses=1200.0,
            savings_goal_name="Emergency & Gadget Fund",
            savings_goal_target=10000.0,
            saving_style="balanced",
            onboarding_completed=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("", response_model=UserProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    """Retrieve current user profile."""
    return get_or_create_default_user(db)

@router.put("", response_model=UserProfileResponse)
def update_profile(data: UserProfileUpdate, db: Session = Depends(get_db)):
    """Update profile fields."""
    user = get_or_create_default_user(db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

@router.post("/seed-demo", response_model=UserProfileResponse)
def seed_demo(db: Session = Depends(get_db)):
    """Wipe and populate realistic student demo data."""
    profile = seed_student_demo_data(db)
    return profile

@router.post("/reset")
def reset_all_data(db: Session = Depends(get_db)):
    """Reset transactions, budgets, goals for a clean start."""
    user = get_or_create_default_user(db)
    user.onboarding_completed = False
    user.monthly_pocket_money = 6000.0
    user.existing_savings = 1000.0
    user.fixed_expenses = 1000.0
    
    # Delete related items
    for tx in user.transactions:
        db.delete(tx)
    for b in user.budgets:
        db.delete(b)
    for g in user.goals:
        db.delete(g)
    for w in user.wishlist_items:
        db.delete(w)
    
    db.commit()
    db.refresh(user)
    return {"message": "All data reset successfully", "profile": user}

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Computes real-time dynamic dashboard summary using deterministic financial engine.
    """
    user = get_or_create_default_user(db)
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    budgets = db.query(BudgetCategory).filter(BudgetCategory.user_id == user.id).all()

    tx_list = [
        {
            "id": t.id,
            "type": t.type,
            "amount": t.amount,
            "category": t.category,
            "date": t.date,
            "payment_method": t.payment_method,
            "note": t.note
        }
        for t in txs
    ]

    budget_list = [
        {
            "category": b.category,
            "allocated_amount": b.allocated_amount
        }
        for b in budgets
    ]

    summary = compute_month_summary(
        monthly_pocket_money=user.monthly_pocket_money,
        existing_savings=user.existing_savings,
        fixed_expenses=user.fixed_expenses,
        transactions=tx_list,
        budgets=budget_list
    )
    summary["user_name"] = user.name
    summary["savings_goal_name"] = user.savings_goal_name
    summary["savings_goal_target"] = user.savings_goal_target
    summary["saving_style"] = user.saving_style
    summary["currency"] = user.currency
    summary["onboarding_completed"] = user.onboarding_completed

    return summary
