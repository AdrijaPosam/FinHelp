import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Transaction
from ..schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from .profile import get_or_create_default_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    category: Optional[str] = None,
    tx_type: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Fetch user transactions with optional filters."""
    user = get_or_create_default_user(db)
    query = db.query(Transaction).filter(Transaction.user_id == user.id)

    if category and category != "All":
        query = query.filter(Transaction.category == category)
    if tx_type and tx_type != "All":
        query = query.filter(Transaction.type == tx_type)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Transaction.note.ilike(search_filter)) |
            (Transaction.category.ilike(search_filter)) |
            (Transaction.payment_method.ilike(search_filter))
        )

    # Order by date descending, then id descending
    results = query.order_by(Transaction.date.desc(), Transaction.id.desc()).limit(limit).all()
    return results


@router.post("", response_model=TransactionResponse)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new income, expense, or savings deposit."""
    user = get_or_create_default_user(db)
    tx = Transaction(
        user_id=user.id,
        type=data.type,
        amount=round(data.amount, 2),
        category=data.category,
        payment_method=data.payment_method,
        note=data.note,
        date=data.date
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.put("/{tx_id}", response_model=TransactionResponse)
def update_transaction(tx_id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    """Update an existing transaction."""
    user = get_or_create_default_user(db)
    tx = db.query(Transaction).filter(Transaction.id == tx_id, Transaction.user_id == user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(tx, key, value)

    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db)):
    """Delete a transaction."""
    user = get_or_create_default_user(db)
    tx = db.query(Transaction).filter(Transaction.id == tx_id, Transaction.user_id == user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted successfully", "id": tx_id}


@router.get("/export/csv")
def export_transactions_csv(db: Session = Depends(get_db)):
    """Export all student transactions as a clean CSV file."""
    user = get_or_create_default_user(db)
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Type", "Category", "Amount (INR)", "Payment Method", "Note"])

    for t in txs:
        writer.writerow([t.id, t.date, t.type.capitalize(), t.category, f"{t.amount:.2f}", t.payment_method, t.note or ""])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=finhelp_transactions.csv"}
    )
