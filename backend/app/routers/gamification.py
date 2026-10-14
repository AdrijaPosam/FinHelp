from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import SavingsGoal, WishlistItem, Transaction
from ..schemas import (
    SavingsGoalCreate,
    SavingsGoalResponse,
    SavingsGoalDeposit,
    WishlistItemCreate,
    WishlistItemResponse
)
from .profile import get_or_create_default_user

router = APIRouter(prefix="/gamification", tags=["Gamification & Quests"])

# --- Savings Goals ---
@router.get("/goals", response_model=List[SavingsGoalResponse])
def get_savings_goals(db: Session = Depends(get_db)):
    """Fetch all savings goals for current user."""
    user = get_or_create_default_user(db)
    return db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()


@router.post("/goals", response_model=SavingsGoalResponse)
def create_savings_goal(data: SavingsGoalCreate, db: Session = Depends(get_db)):
    """Create a new savings quest goal."""
    user = get_or_create_default_user(db)
    goal = SavingsGoal(
        user_id=user.id,
        title=data.title,
        target_amount=data.target_amount,
        saved_amount=data.saved_amount,
        target_date=data.target_date,
        icon=data.icon or "🎯",
        is_completed=(data.saved_amount >= data.target_amount)
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.post("/goals/{goal_id}/deposit", response_model=SavingsGoalResponse)
def deposit_to_goal(goal_id: int, data: SavingsGoalDeposit, db: Session = Depends(get_db)):
    """
    Deposit funds into a savings goal.
    Automatically creates a 'savings_deposit' transaction to keep finance records synchronized.
    """
    user = get_or_create_default_user(db)
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    amount = round(data.amount, 2)
    goal.saved_amount = round(goal.saved_amount + amount, 2)
    if goal.saved_amount >= goal.target_amount:
        goal.is_completed = True

    # Synchronize transaction record
    tx = Transaction(
        user_id=user.id,
        type="savings_deposit",
        amount=amount,
        category="Other",
        payment_method=data.payment_method,
        note=f"Contribution to '{goal.title}' ({data.note or ''})".strip(),
        date=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(tx)
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/goals/{goal_id}")
def delete_savings_goal(goal_id: int, db: Session = Depends(get_db)):
    """Delete a savings goal."""
    user = get_or_create_default_user(db)
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully", "id": goal_id}


# --- Cooling-off Wishlist ---
@router.get("/wishlist", response_model=List[WishlistItemResponse])
def get_wishlist(db: Session = Depends(get_db)):
    """List cooling-off wishlist items."""
    user = get_or_create_default_user(db)
    return db.query(WishlistItem).filter(WishlistItem.user_id == user.id).order_by(WishlistItem.created_at.desc()).all()


@router.post("/wishlist", response_model=WishlistItemResponse)
def add_to_wishlist(data: WishlistItemCreate, db: Session = Depends(get_db)):
    """Add a tempted purchase to cooling-off period."""
    user = get_or_create_default_user(db)
    item = WishlistItem(
        user_id=user.id,
        item_name=data.item_name,
        price=data.price,
        category=data.category,
        classification=data.classification,
        reason=data.reason,
        review_date=data.review_date,
        status="cooling"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/wishlist/{item_id}/status", response_model=WishlistItemResponse)
def update_wishlist_status(item_id: int, status: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Update status ('cooling', 'bought', 'skipped')."""
    user = get_or_create_default_user(db)
    item = db.query(WishlistItem).filter(WishlistItem.id == item_id, WishlistItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    item.status = status
    db.commit()
    db.refresh(item)
    return item


@router.delete("/wishlist/{item_id}")
def delete_wishlist_item(item_id: int, db: Session = Depends(get_db)):
    """Remove wishlist item."""
    user = get_or_create_default_user(db)
    item = db.query(WishlistItem).filter(WishlistItem.id == item_id, WishlistItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Wishlist item removed", "id": item_id}


# --- Challenges & Badges ---
@router.get("/challenges")
def get_challenges(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Calculates active student challenges with live progress tracking."""
    user = get_or_create_default_user(db)
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    wishlist = db.query(WishlistItem).filter(WishlistItem.user_id == user.id).all()
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()

    tx_count = len(txs)
    total_saved = sum(t.amount for t in txs if t.type == "savings_deposit")
    skipped_count = sum(1 for w in wishlist if w.status == "skipped")
    goals_met = sum(1 for g in goals if g.is_completed)

    challenges = [
        {
            "id": 1,
            "title": "Chai & Snack Tracker",
            "description": "Log at least 5 transactions to build real financial awareness.",
            "reward_points": 50,
            "badge_name": "Awareness Master",
            "icon": "📝",
            "current": min(5, tx_count),
            "target": 5,
            "completed": tx_count >= 5
        },
        {
            "id": 2,
            "title": "Impulse Shield",
            "description": "Use the Cooling-off Wishlist and choose to 'skip' an unnecessary impulse buy.",
            "reward_points": 100,
            "badge_name": "Willpower Warrior",
            "icon": "🛡️",
            "current": min(1, skipped_count),
            "target": 1,
            "completed": skipped_count >= 1
        },
        {
            "id": 3,
            "title": "₹500 Goal Booster",
            "description": "Stash at least ₹500 into your savings goals this month.",
            "reward_points": 150,
            "badge_name": "Pocket Money Hero",
            "icon": "💰",
            "current": min(500, int(total_saved)),
            "target": 500,
            "completed": total_saved >= 500
        },
        {
            "id": 4,
            "title": "Savings Quest Finisher",
            "description": "Reach 100% on any savings goal.",
            "reward_points": 200,
            "badge_name": "Goal Crusher",
            "icon": "🏆",
            "current": min(1, goals_met),
            "target": 1,
            "completed": goals_met >= 1
        }
    ]
    return challenges


@router.get("/badges")
def get_badges(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns achievements unlocked based on real user actions."""
    user = get_or_create_default_user(db)
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    wishlist = db.query(WishlistItem).filter(WishlistItem.user_id == user.id).all()
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()

    tx_count = len(txs)
    total_saved = sum(t.amount for t in txs if t.type == "savings_deposit")
    skipped_count = sum(1 for w in wishlist if w.status == "skipped")
    has_completed_goal = any(g.is_completed for g in goals)

    return [
        {
            "id": "first_tx",
            "title": "First Step Taken",
            "description": "Logged your first expense or income.",
            "icon": "🌱",
            "unlocked": tx_count >= 1
        },
        {
            "id": "streak_3",
            "title": "Habit Builder",
            "description": "Logged 5 or more transactions.",
            "icon": "🔥",
            "unlocked": tx_count >= 5
        },
        {
            "id": "cool_off",
            "title": "Mindful Zen",
            "description": "Saved an impulse buy to the cooling-off list and skipped it.",
            "icon": "🧘",
            "unlocked": skipped_count >= 1
        },
        {
            "id": "goal_deposit",
            "title": "Piggy Bank Stuffer",
            "description": "Deposited over ₹500 towards your dreams.",
            "icon": "🚀",
            "unlocked": total_saved >= 500
        },
        {
            "id": "champion",
            "title": "Goal Champion",
            "description": "Fully reached 100% of a savings goal.",
            "icon": "🏆",
            "unlocked": has_completed_goal
        }
    ]
