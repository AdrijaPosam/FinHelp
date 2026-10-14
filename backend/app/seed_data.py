from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import UserProfile, Transaction, BudgetCategory, SavingsGoal, WishlistItem

def seed_student_demo_data(db: Session) -> UserProfile:
    """
    Clears existing records and populates realistic Indian college student demo data.
    Designed for college exhibitions and instant live exploration.
    """
    # Clear existing tables
    db.query(WishlistItem).delete()
    db.query(SavingsGoal).delete()
    db.query(BudgetCategory).delete()
    db.query(Transaction).delete()
    db.query(UserProfile).delete()
    db.commit()

    # 1. Create Profile
    profile = UserProfile(
        id=1,
        name="Aarav Sharma",
        monthly_pocket_money=7500.0,
        existing_savings=2500.0,
        fixed_expenses=1400.0,  # Metro smart card + Phone recharge + hostel wifi
        savings_goal_name="MacBook / Laptop Upgrade",
        savings_goal_target=20000.0,
        saving_style="balanced",
        currency="₹",
        onboarding_completed=True
    )
    db.add(profile)
    db.flush()

    # 2. Budget Allocations for categories
    default_budgets = [
        {"category": "Food & Canteen", "allocated_amount": 2500.0},
        {"category": "Transit & Travel", "allocated_amount": 1000.0},
        {"category": "College & Books", "allocated_amount": 800.0},
        {"category": "Shopping & Clothes", "allocated_amount": 700.0},
        {"category": "Hangouts & Fun", "allocated_amount": 800.0},
        {"category": "Subscriptions & Tech", "allocated_amount": 300.0},
    ]
    for b in default_budgets:
        db.add(BudgetCategory(user_id=profile.id, category=b["category"], allocated_amount=b["allocated_amount"]))

    # 3. Realistic Recent Transactions (Spread over the past 14 days)
    today = datetime.now()
    demo_txs = [
        # Additional Incomes (e.g. Freelance assignment, festival gift)
        {"type": "income", "amount": 1200.0, "category": "Other", "method": "UPI", "note": "Freelance presentation design for college senior", "days_ago": 8},
        {"type": "income", "amount": 500.0, "category": "Gifts & Pocket Money", "method": "UPI", "note": "Grandma festival blessing gift", "days_ago": 12},
        
        # Savings Deposits (Moving money into goals)
        {"type": "savings_deposit", "amount": 600.0, "category": "Other", "method": "UPI", "note": "Stashed away for Laptop Goal", "days_ago": 13},
        {"type": "savings_deposit", "amount": 400.0, "category": "Other", "method": "UPI", "note": "Emergency backup fund", "days_ago": 6},

        # Everyday College Expenses
        {"type": "expense", "amount": 500.0, "category": "Transit & Travel", "method": "UPI", "note": "Delhi/Mumbai Metro Smart Card Monthly Pass", "days_ago": 13},
        {"type": "expense", "amount": 140.0, "category": "Food & Canteen", "method": "UPI", "note": "Canteen Special Thali + Chaas", "days_ago": 12},
        {"type": "expense", "amount": 60.0, "category": "Food & Canteen", "method": "Cash", "note": "Campus Tapri Adrak Chai & 2 Samosas", "days_ago": 11},
        {"type": "expense", "amount": 380.0, "category": "College & Books", "method": "UPI", "note": "Data Structures Reference Book & Notebooks", "days_ago": 10},
        {"type": "expense", "amount": 250.0, "category": "Hangouts & Fun", "method": "UPI", "note": "CCD Cold Coffee with study group", "days_ago": 9},
        {"type": "expense", "amount": 59.0, "category": "Subscriptions & Tech", "method": "UPI", "note": "Spotify Student Premium Plan", "days_ago": 8},
        {"type": "expense", "amount": 180.0, "category": "Food & Canteen", "method": "UPI", "note": "Late night hostel maggi & rolls order", "days_ago": 7},
        {"type": "expense", "amount": 85.0, "category": "Personal Care", "method": "UPI", "note": "Haircut & trimming at local salon", "days_ago": 5},
        {"type": "expense", "amount": 450.0, "category": "Shopping & Clothes", "method": "Card", "note": "College graphic hoodie on Myntra sale", "days_ago": 4},
        {"type": "expense", "amount": 120.0, "category": "Food & Canteen", "method": "UPI", "note": "Rajma Chawal at College Cafeteria", "days_ago": 3},
        {"type": "expense", "amount": 300.0, "category": "Hangouts & Fun", "method": "UPI", "note": "Weekend movie ticket (Student discount)", "days_ago": 2},
        {"type": "expense", "amount": 45.0, "category": "Food & Canteen", "method": "Cash", "note": "Evening Chai & Biscuits with project partner", "days_ago": 1},
    ]

    for tx in demo_txs:
        tx_date = (today - timedelta(days=tx["days_ago"])).strftime("%Y-%m-%d")
        db.add(Transaction(
            user_id=profile.id,
            type=tx["type"],
            amount=tx["amount"],
            category=tx["category"],
            payment_method=tx["method"],
            note=tx["note"],
            date=tx_date
        ))

    # 4. Savings Goals
    db.add(SavingsGoal(
        user_id=profile.id,
        title="MacBook / Laptop Upgrade",
        target_amount=20000.0,
        saved_amount=6000.0,
        target_date=(today + timedelta(days=90)).strftime("%Y-%m-%d"),
        icon="💻",
        is_completed=False
    ))
    db.add(SavingsGoal(
        user_id=profile.id,
        title="College Goa / Manali Trip",
        target_amount=8000.0,
        saved_amount=3200.0,
        target_date=(today + timedelta(days=120)).strftime("%Y-%m-%d"),
        icon="🏖️",
        is_completed=False
    ))
    db.add(SavingsGoal(
        user_id=profile.id,
        title="Noise-Cancelling Headphones",
        target_amount=3500.0,
        saved_amount=3500.0,
        target_date=(today - timedelta(days=10)).strftime("%Y-%m-%d"),
        icon="🎧",
        is_completed=True
    ))

    # 5. Cooling-off Wishlist Items
    db.add(WishlistItem(
        user_id=profile.id,
        item_name="Mechanical Gaming Keyboard",
        price=1899.0,
        category="Subscriptions & Tech",
        classification="want",
        reason="Looks super cool for hostel desk setup",
        review_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
        status="cooling"
    ))
    db.add(WishlistItem(
        user_id=profile.id,
        item_name="Sneakers on 40% Discount",
        price=2200.0,
        category="Shopping & Clothes",
        classification="want",
        reason="Seen on sale, reconsidering if needed right now",
        review_date=(today + timedelta(days=4)).strftime("%Y-%m-%d"),
        status="cooling"
    ))

    db.commit()
    db.refresh(profile)
    return profile
