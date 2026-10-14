import calendar
from datetime import datetime
from typing import Dict, List, Any, Optional

STANDARD_CATEGORIES = [
    "Food & Canteen",
    "Transit & Travel",
    "Shopping & Clothes",
    "College & Books",
    "Hangouts & Fun",
    "Subscriptions & Tech",
    "Personal Care",
    "Gifts & Donations",
    "Other"
]

def get_days_info(date_str: Optional[str] = None) -> Dict[str, int]:
    """Returns total days in the month and days remaining based on date_str (YYYY-MM-DD) or current date."""
    if date_str:
        try:
            dt = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            dt = datetime.now()
    else:
        dt = datetime.now()

    year = dt.year
    month = dt.month
    day = dt.day

    _, total_days = calendar.monthrange(year, month)
    days_passed = day
    days_left = max(1, total_days - day + 1)  # including today

    return {
        "year": year,
        "month": month,
        "current_day": day,
        "total_days": total_days,
        "days_passed": days_passed,
        "days_left": days_left
    }


def compute_month_summary(
    monthly_pocket_money: float,
    existing_savings: float,
    fixed_expenses: float,
    transactions: List[Dict[str, Any]],
    budgets: Optional[List[Dict[str, Any]]] = None,
    current_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Deterministic financial engine.
    Computes real-time totals, remaining balances, safe daily spend,
    category breakdowns, and spending velocity.
    """
    # Safe floats
    pocket_money = max(0.0, float(monthly_pocket_money or 0.0))
    existing_sav = max(0.0, float(existing_savings or 0.0))
    fixed_exp = max(0.0, float(fixed_expenses or 0.0))

    days_info = get_days_info(current_date)

    # Accumulators
    additional_income = 0.0
    total_expenses = 0.0
    total_savings_deposits = 0.0
    category_expenses: Dict[str, float] = {cat: 0.0 for cat in STANDARD_CATEGORIES}
    recent_tx_count = len(transactions)

    # Weekly spending buckets (last 7 days approx or by week index)
    weekly_buckets = [0.0, 0.0, 0.0, 0.0, 0.0]

    for tx in transactions:
        tx_type = tx.get("type", "expense").lower()
        amount = max(0.0, float(tx.get("amount", 0.0)))
        cat = tx.get("category", "Other")
        date_val = tx.get("date", "")

        if tx_type == "income":
            additional_income += amount
        elif tx_type == "savings_deposit":
            total_savings_deposits += amount
        else:  # expense
            total_expenses += amount
            if cat in category_expenses:
                category_expenses[cat] += amount
            else:
                category_expenses["Other"] = category_expenses.get("Other", 0.0) + amount

            # Bucket into week of month if date valid
            try:
                tx_dt = datetime.strptime(date_val[:10], "%Y-%m-%d")
                week_idx = min(4, (tx_dt.day - 1) // 7)
                weekly_buckets[week_idx] += amount
            except Exception:
                weekly_buckets[0] += amount

    # Total funds available for this month
    total_monthly_inflow = pocket_money + additional_income
    
    # Flexible spendable pool after committed fixed expenses
    flexible_spending_allowance = max(0.0, total_monthly_inflow - fixed_exp)

    # Remaining safe spend for this month
    # Note: savings deposits move money into saved piggy bank, so they reduce spendable cash
    remaining_safe_spend = total_monthly_inflow - fixed_exp - total_expenses - total_savings_deposits
    remaining_safe_spend = round(remaining_safe_spend, 2)

    # Total actual savings = existing savings accumulated + this month's savings deposits
    total_current_savings = existing_sav + total_savings_deposits

    # Safe daily and weekly spend limits
    days_left = days_info["days_left"]
    if remaining_safe_spend > 0:
        safe_daily_spend = round(remaining_safe_spend / days_left, 2)
    else:
        safe_daily_spend = 0.0
    
    safe_weekly_spend = round(safe_daily_spend * 7, 2)

    # Spending velocity analysis
    month_progress_pct = round((days_info["days_passed"] / days_info["total_days"]) * 100, 1)
    if total_expenses <= 0:
        spend_pct = 0.0
    elif flexible_spending_allowance > 0:
        spend_pct = round((total_expenses / flexible_spending_allowance) * 100, 1)
    else:
        spend_pct = 100.0

    if spend_pct > (month_progress_pct + 18):
        spending_pace_status = "overspending"
        pace_message = f"You have spent {spend_pct}% of your flexible budget while only {month_progress_pct}% of the month has passed. Stick to ₹{safe_daily_spend:.0f}/day to finish strong!"
    elif spend_pct > (month_progress_pct + 5):
        spending_pace_status = "caution"
        pace_message = f"Spending is slightly ahead of pace ({spend_pct}% vs {month_progress_pct}% of month). Safe daily cap: ₹{safe_daily_spend:.0f}."
    else:
        spending_pace_status = "healthy"
        pace_message = f"Great pacing! You are on track with ₹{safe_daily_spend:.0f}/day safe spending limit."

    # Category breakdown array with percentages
    category_breakdown = []
    budget_map = {b.get("category"): float(b.get("allocated_amount", 0.0)) for b in (budgets or [])}

    for cat_name, spent_val in category_expenses.items():
        if spent_val > 0 or cat_name in budget_map:
            pct = round((spent_val / max(1.0, total_expenses)) * 100, 1) if total_expenses > 0 else 0.0
            allocated = budget_map.get(cat_name, 0.0)
            status = "normal"
            if allocated > 0:
                usage_pct = (spent_val / allocated) * 100
                if usage_pct >= 100:
                    status = "exceeded"
                elif usage_pct >= 85:
                    status = "warning"
            category_breakdown.append({
                "category": cat_name,
                "spent": round(spent_val, 2),
                "allocated": round(allocated, 2),
                "percentage": pct,
                "status": status
            })

    # Sort categories by spent descending
    category_breakdown.sort(key=lambda x: x["spent"], reverse=True)

    # Determine spending personality
    personality = determine_spending_personality(category_expenses, total_expenses, total_savings_deposits, pocket_money)

    return {
        "pocket_money": pocket_money,
        "additional_income": round(additional_income, 2),
        "total_monthly_inflow": round(total_monthly_inflow, 2),
        "fixed_expenses": fixed_exp,
        "flexible_spending_allowance": round(flexible_spending_allowance, 2),
        "total_expenses": round(total_expenses, 2),
        "total_savings_deposits": round(total_savings_deposits, 2),
        "existing_savings": existing_sav,
        "total_current_savings": round(total_current_savings, 2),
        "remaining_safe_spend": remaining_safe_spend,
        "safe_daily_spend": safe_daily_spend,
        "safe_weekly_spend": safe_weekly_spend,
        "days_left": days_left,
        "total_days": days_info["total_days"],
        "current_day": days_info["current_day"],
        "spending_pace_status": spending_pace_status,
        "pace_message": pace_message,
        "spend_percentage": spend_pct,
        "category_breakdown": category_breakdown,
        "weekly_spending": [
            {"week": "Week 1", "amount": round(weekly_buckets[0], 2)},
            {"week": "Week 2", "amount": round(weekly_buckets[1], 2)},
            {"week": "Week 3", "amount": round(weekly_buckets[2], 2)},
            {"week": "Week 4", "amount": round(weekly_buckets[3], 2)},
            {"week": "Week 5", "amount": round(weekly_buckets[4], 2)},
        ],
        "personality": personality
    }


def determine_spending_personality(
    category_expenses: Dict[str, float],
    total_expenses: float,
    total_savings_deposits: float,
    pocket_money: float
) -> Dict[str, str]:
    """
    Transparent rule-based persona tagging for students.
    """
    if total_expenses <= 0 and total_savings_deposits <= 0:
        return {
            "title": "The Fresh Explorer",
            "tagline": "Starting clean and ready to build smart money habits!",
            "badge_icon": "🌱",
            "reason": "You're beginning your financial journey with FinHelp."
        }

    food_spend = category_expenses.get("Food & Canteen", 0.0)
    shopping_spend = category_expenses.get("Shopping & Clothes", 0.0)
    fun_spend = category_expenses.get("Hangouts & Fun", 0.0)

    # Check rule thresholds
    if total_savings_deposits >= (pocket_money * 0.20) and total_savings_deposits > 0:
        return {
            "title": "The Goal Getter",
            "tagline": "Prioritizing future freedom and crushing savings targets!",
            "badge_icon": "🚀",
            "reason": f"You've stashed away ₹{total_savings_deposits:.0f} (over 20% of pocket money) into your savings."
        }
    
    if (food_spend / max(1.0, total_expenses)) > 0.40:
        return {
            "title": "The Canteen Connoisseur",
            "tagline": "Fueling campus life one samosa and cold coffee at a time.",
            "badge_icon": "☕",
            "reason": f"Food & snacks represent {round((food_spend / total_expenses) * 100)}% of your total spending."
        }

    if (shopping_spend / max(1.0, total_expenses)) > 0.35:
        return {
            "title": "The Little Treat Lover",
            "tagline": "Appreciating life's rewards, with room to catch impulsive buys.",
            "badge_icon": "🛍️",
            "reason": f"Shopping accounts for {round((shopping_spend / total_expenses) * 100)}% of your expenses."
        }

    if (fun_spend / max(1.0, total_expenses)) > 0.35:
        return {
            "title": "The Social Butterfly",
            "tagline": "Making college memories and bringing friends together.",
            "badge_icon": "🎉",
            "reason": f"Hangouts & fun make up {round((fun_spend / total_expenses) * 100)}% of your spending."
        }

    return {
        "title": "The Balanced Spender",
        "tagline": "Mastering the sweet spot between enjoying college and saving.",
        "badge_icon": "⚖️",
        "reason": "Your expenses are evenly distributed across categories without excessive spikes."
    }


def evaluate_purchase_affordability(
    item_name: str,
    price: float,
    category: str,
    classification: str,
    summary: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates purchase against deterministic budget metrics.
    classification: 'need', 'want', or 'unsure'
    """
    price = max(0.0, float(price))
    remaining = float(summary.get("remaining_safe_spend", 0.0))
    daily_spend = float(summary.get("safe_daily_spend", 0.0))
    balance_after = remaining - price
    
    # Days of safe daily budget consumed by this purchase
    daily_budget_equivalent = round(price / max(1.0, daily_spend), 1) if daily_spend > 0 else 999.0
    budget_impact_percent = round((price / max(1.0, remaining)) * 100, 1) if remaining > 0 else 100.0

    # Logic decision
    if price > remaining:
        verdict = "danger"
        verdict_title = "Out of Budget Right Now"
        status_code = "not_recommended"
        should_cool_off = True
        advice = f"Buying {item_name} for ₹{price:.0f} exceeds your remaining cash by ₹{abs(balance_after):.0f}. Wait until next month's pocket money or save for it gradually."
    elif classification == "need" and balance_after >= 0:
        verdict = "safe"
        verdict_title = "Essential Purchase - Approved"
        status_code = "safe"
        should_cool_off = False
        advice = f"Since this is an essential need and you have ₹{remaining:.0f} remaining, this fits in your budget. You'll still have ₹{balance_after:.0f} safe spend."
    elif classification == "want" and daily_budget_equivalent > 3.0:
        verdict = "warning"
        verdict_title = "High Budget Impact"
        status_code = "caution"
        should_cool_off = True
        advice = f"This purchase equals {daily_budget_equivalent} days of your entire daily living budget! It leaves ₹{balance_after:.0f} for the remaining {summary.get('days_left', 1)} days."
    elif balance_after >= (daily_spend * 4):
        verdict = "safe"
        verdict_title = "Comfortably Affordable"
        status_code = "safe"
        should_cool_off = False
        advice = f"Go for it mindfully! You will have ₹{balance_after:.0f} left, keeping your safe daily spend comfortably intact."
    else:
        verdict = "warning"
        verdict_title = "Tight Fit - Think Twice"
        status_code = "caution"
        should_cool_off = True
        advice = f"You can technically afford it, but it uses {budget_impact_percent}% of your remaining monthly cash. Consider a 48-hour cooling-off pause."

    reflection_questions = {
        "need": "Is there a student discount, campus library copy, or shared option available?",
        "want": "Will you still be excited about this purchase 3 weeks from now, or is it an impulse craving?",
        "unsure": "If you put this in your Cooling-off Wishlist for 48 hours, will you miss it?"
    }

    reflection_q = reflection_questions.get(classification, "How will you feel about this purchase tomorrow morning?")

    return {
        "item_name": item_name,
        "price": price,
        "category": category,
        "classification": classification,
        "verdict": verdict,
        "verdict_title": verdict_title,
        "status_code": status_code,
        "remaining_before": remaining,
        "remaining_after": round(balance_after, 2),
        "budget_impact_percent": budget_impact_percent,
        "daily_budget_equivalent": daily_budget_equivalent,
        "should_cool_off": should_cool_off,
        "recommended_cool_off_days": 7 if price > 1500 else 2,
        "advice": advice,
        "reflection_question": reflection_q
    }
