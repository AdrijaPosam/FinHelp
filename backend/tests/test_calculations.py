import pytest
from app.calculations import compute_month_summary, evaluate_purchase_affordability, determine_spending_personality

def test_compute_month_summary_basic():
    # Student with ₹6,000 pocket money, ₹1,000 fixed expenses
    transactions = [
        {"type": "expense", "amount": 500.0, "category": "Food & Canteen", "date": "2026-10-01"},
        {"type": "expense", "amount": 200.0, "category": "Transit & Travel", "date": "2026-10-02"},
        {"type": "income", "amount": 500.0, "category": "Other", "date": "2026-10-03"},
        {"type": "savings_deposit", "amount": 300.0, "category": "Other", "date": "2026-10-04"}
    ]
    summary = compute_month_summary(
        monthly_pocket_money=6000.0,
        existing_savings=1000.0,
        fixed_expenses=1000.0,
        transactions=transactions,
        current_date="2026-10-14"
    )

    # Inflow = 6000 + 500 = 6500
    assert summary["total_monthly_inflow"] == 6500.0
    # Fixed = 1000
    assert summary["fixed_expenses"] == 1000.0
    # Total expenses = 500 + 200 = 700
    assert summary["total_expenses"] == 700.0
    # Total savings deposit = 300
    assert summary["total_savings_deposits"] == 300.0
    # Remaining safe spend = 6500 - 1000 - 700 - 300 = 4500
    assert summary["remaining_safe_spend"] == 4500.0
    # Total current savings = 1000 existing + 300 deposited = 1300
    assert summary["total_current_savings"] == 1300.0
    # Days left in Oct (31 - 14 + 1 = 18)
    assert summary["days_left"] == 18
    # Safe daily spend = 4500 / 18 = 250.0
    assert summary["safe_daily_spend"] == 250.0

def test_zero_income_and_empty_transactions():
    summary = compute_month_summary(
        monthly_pocket_money=0.0,
        existing_savings=0.0,
        fixed_expenses=0.0,
        transactions=[],
        current_date="2026-10-01"
    )
    assert summary["total_monthly_inflow"] == 0.0
    assert summary["remaining_safe_spend"] == 0.0
    assert summary["safe_daily_spend"] == 0.0
    assert summary["spending_pace_status"] == "healthy"

def test_overspending_pace():
    # High expenses early in month
    transactions = [
        {"type": "expense", "amount": 4000.0, "category": "Shopping & Clothes", "date": "2026-10-02"}
    ]
    summary = compute_month_summary(
        monthly_pocket_money=5000.0,
        existing_savings=0.0,
        fixed_expenses=0.0,
        transactions=transactions,
        current_date="2026-10-05"
    )
    # 4000 spent out of 5000 is 80%, while only day 5 of 31 (16%)
    assert summary["spending_pace_status"] == "overspending"

def test_purchase_reality_check_danger():
    summary = {
        "remaining_safe_spend": 500.0,
        "safe_daily_spend": 50.0,
        "days_left": 10
    }
    result = evaluate_purchase_affordability(
        item_name="Branded Shoes",
        price=1200.0,
        category="Shopping & Clothes",
        classification="want",
        summary=summary
    )
    assert result["verdict"] == "danger"
    assert result["should_cool_off"] is True
    assert result["remaining_after"] < 0

def test_purchase_reality_check_safe_need():
    summary = {
        "remaining_safe_spend": 2000.0,
        "safe_daily_spend": 100.0,
        "days_left": 20
    }
    result = evaluate_purchase_affordability(
        item_name="College Lab Manual",
        price=150.0,
        category="College & Books",
        classification="need",
        summary=summary
    )
    assert result["verdict"] == "safe"
    assert result["should_cool_off"] is False
    assert result["remaining_after"] == 1850.0
