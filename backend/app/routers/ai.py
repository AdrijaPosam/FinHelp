from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from ..database import get_db
from ..models import UserProfile, Transaction, BudgetCategory
from ..schemas import (
    PurchaseCheckRequest,
    PurchaseCheckResponse,
    FinnyChatRequest,
    FinnyChatResponse,
    MonthlyInsightResponse
)
from ..calculations import compute_month_summary, evaluate_purchase_affordability
from ..ai_service import get_ai_purchase_reality_check, ask_finny_chat, generate_monthly_insight
from .profile import get_or_create_default_user

router = APIRouter(prefix="/ai", tags=["AI Buddy & Reality Check"])

def get_current_user_summary(db: Session) -> Dict[str, Any]:
    user = get_or_create_default_user(db)
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    budgets = db.query(BudgetCategory).filter(BudgetCategory.user_id == user.id).all()

    tx_list = [
        {"id": t.id, "type": t.type, "amount": t.amount, "category": t.category, "date": t.date, "payment_method": t.payment_method}
        for t in txs
    ]
    budget_list = [
        {"category": b.category, "allocated_amount": b.allocated_amount}
        for b in budgets
    ]

    return compute_month_summary(
        monthly_pocket_money=user.monthly_pocket_money,
        existing_savings=user.existing_savings,
        fixed_expenses=user.fixed_expenses,
        transactions=tx_list,
        budgets=budget_list
    )


@router.post("/purchase-reality-check", response_model=PurchaseCheckResponse)
async def check_purchase_affordability(data: PurchaseCheckRequest, db: Session = Depends(get_db)):
    """
    Evaluates proposed purchase deterministically first, then enriches with AI mindful advice.
    """
    summary = get_current_user_summary(db)
    
    # 1. Deterministic evaluation (Never relies on AI for arithmetic!)
    eval_result = evaluate_purchase_affordability(
        item_name=data.item_name,
        price=data.price,
        category=data.category,
        classification=data.classification,
        summary=summary
    )

    # 2. Enrich with AI buddy thought or fallback coaching
    enriched = await get_ai_purchase_reality_check(
        item_name=data.item_name,
        price=data.price,
        category=data.category,
        classification=data.classification,
        reason=data.reason,
        summary=summary,
        eval_result=eval_result
    )

    return enriched


@router.post("/finny-chat", response_model=FinnyChatResponse)
async def chat_with_finny_endpoint(data: FinnyChatRequest, db: Session = Depends(get_db)):
    """
    Ask Finny conversational AI. Injects real student financial summary into prompt.
    """
    summary = get_current_user_summary(db)
    history_dicts = [{"role": m.role, "content": m.content} for m in data.history]
    
    result = await ask_finny_chat(
        message=data.message,
        history=history_dicts,
        summary=summary
    )
    return result


@router.get("/monthly-insight", response_model=MonthlyInsightResponse)
async def get_monthly_insight_endpoint(db: Session = Depends(get_db)):
    """
    Generates friendly monthly overview with positive habits and 2-3 tips.
    """
    summary = get_current_user_summary(db)
    insight = await generate_monthly_insight(summary)
    return insight
