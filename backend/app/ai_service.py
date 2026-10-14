import httpx
import json
import logging
from typing import Dict, Any, List, Optional
from .config import settings

logger = logging.getLogger("finhelp.ai")

async def query_gemini_api(prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
    """
    Calls Google Gemini API via official REST endpoint using settings.GEMINI_API_KEY.
    Returns response text or None if unavailable/error.
    """
    if not settings.GEMINI_API_KEY:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    
    payload: Dict[str, Any] = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 600
        }
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.warning(f"Gemini API request failed: {e}")

    return None


async def get_ai_purchase_reality_check(
    item_name: str,
    price: float,
    category: str,
    classification: str,
    reason: Optional[str],
    summary: Dict[str, Any],
    eval_result: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates student-focused mindful commentary on a proposed purchase.
    """
    remaining = eval_result["remaining_before"]
    daily_budget = summary.get("safe_daily_spend", 0.0)
    days_left = summary.get("days_left", 1)

    system_prompt = (
        "You are Finny, a friendly, encouraging AI student finance buddy for an Indian college student. "
        "Your mission is to help students build mindful spending habits without shaming them. "
        "Use Indian context (₹ Rupee, campus life, chai, canteen, notes, UPI). "
        "Keep your response concise (2-3 sentences), warm, and practical."
    )

    user_prompt = f"""
    The student wants to buy: '{item_name}'
    Price: ₹{price:.0f}
    Category: {category}
    Type: {classification} ({'Essential need' if classification == 'need' else 'Discretionary want'})
    Student's justification: '{reason or "None specified"}'
    
    Verified Financial Status:
    - Remaining spendable pocket money for this month: ₹{remaining:.0f}
    - Safe daily spending limit: ₹{daily_budget:.0f}/day
    - Days left in month: {days_left}
    - Remaining if bought: ₹{eval_result['remaining_after']:.0f}
    - Pre-calculated verdict: {eval_result['verdict_title']}

    Provide an encouraging 2-sentence buddy thought about this purchase. Suggest a mindful student alternative or cooling-off tip if applicable.
    """

    ai_text = await query_gemini_api(user_prompt, system_instruction=system_prompt)
    
    if ai_text:
        eval_result["ai_enhanced_thought"] = ai_text
        eval_result["source"] = "gemini"
    else:
        # High quality rule-based response
        if eval_result["verdict"] == "danger":
            thought = (
                f"Hey, ₹{price:.0f} is a bit steep right now since you have ₹{remaining:.0f} left for the month! "
                f"Let's put this into your Cooling-off Wishlist and celebrate getting it next month or when you hit your savings goal."
            )
        elif eval_result["verdict"] == "warning":
            thought = (
                f"₹{price:.0f} takes away about {eval_result['daily_budget_equivalent']} days of your safe daily allowance (₹{daily_budget:.0f}/day). "
                f"If you wait 48 hours, you'll know for sure whether you truly love it or if it's just a fleeting campus impulse."
            )
        else:
            thought = (
                f"Your budget has room for this ₹{price:.0f} {item_name}! "
                f"Since your safe daily budget stays healthy at ₹{(eval_result['remaining_after'] / max(1, days_left)):.0f}/day, enjoy it guilt-free."
            )
        eval_result["ai_enhanced_thought"] = thought
        eval_result["source"] = "smart_advisor"

    return eval_result


async def ask_finny_chat(
    message: str,
    history: List[Dict[str, str]],
    summary: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Answers student finance questions using verified deterministic mathematical context.
    """
    msg_lower = message.lower().strip()
    remaining = summary.get("remaining_safe_spend", 0.0)
    daily_spend = summary.get("safe_daily_spend", 0.0)
    pocket_money = summary.get("pocket_money", 0.0)
    spent = summary.get("total_expenses", 0.0)
    saved = summary.get("total_current_savings", 0.0)
    days_left = summary.get("days_left", 1)
    personality = summary.get("personality", {}).get("title", "Student")

    # System instruction with strict factual grounding
    system_instruction = (
        "You are Finny, a friendly, witty, and smart AI student finance buddy in India. "
        "Speak casually with warmth (like an experienced senior or helpful roommate). "
        "Always use the verified financial data provided below. Do NOT hallucinate different figures. "
        "Keep replies under 120 words with bullet points if helpful. "
        "Never pretend to be an accredited SEBI financial advisor."
    )

    financial_context = (
        f"Verified User Stats:\n"
        f"- Monthly Pocket Money: ₹{pocket_money:.0f}\n"
        f"- Total Spent this Month: ₹{spent:.0f}\n"
        f"- Total Savings Stashed: ₹{saved:.0f}\n"
        f"- Remaining Safe Spend: ₹{remaining:.0f}\n"
        f"- Safe Daily Spend Cap: ₹{daily_spend:.0f}/day\n"
        f"- Days Remaining in Month: {days_left} days\n"
        f"- Spending Persona: {personality}\n"
    )

    full_prompt = f"{financial_context}\nStudent says: '{message}'\nAnswer as Finny:"

    ai_reply = await query_gemini_api(full_prompt, system_instruction=system_instruction)
    
    if ai_reply:
        return {
            "reply": ai_reply,
            "quick_suggestions": [
                "Can I afford to go out this weekend?",
                "How can I save ₹500 more this month?",
                "What happens if I save ₹50 every day?"
            ],
            "source": "gemini"
        }

    # Deterministic rule-based smart assistant
    if "weekend" in msg_lower or "go out" in msg_lower or "party" in msg_lower:
        weekend_budget = daily_spend * 2.5
        if remaining <= 300:
            reply = (
                f"Honest buddy check: Your remaining spend is quite tight right now (₹{remaining:.0f} left for {days_left} days). "
                f"A full weekend outing might push you into debt or borrow mode. "
                f"How about a campus hostel movie night or a cozy ₹50 chai & stroll with friends instead?"
            )
        elif remaining >= 1500:
            reply = (
                f"Good news! You have ₹{remaining:.0f} left for the month, giving you a safe weekend hangout budget of about ₹{weekend_budget:.0f}. "
                f"Just pay via UPI so you don't lose track, and you're good to enjoy!"
            )
        else:
            reply = (
                f"You can do a chill weekend outing! Keep your spending capped around ₹{min(daily_spend * 2, remaining * 0.4):.0f}. "
                f"That preserves enough fuel for the remaining {days_left} days of the month."
            )

    elif "save" in msg_lower and "50" in msg_lower:
        one_month = 50 * 30
        one_year = 50 * 365
        three_years = 50 * 365 * 3
        reply = (
            f"Saving ₹50 a day is a superpower! 🚀\n\n"
            f"• **In 1 month**: ₹{one_month:,} (enough for a great semester book or dinner)\n"
            f"• **In 1 year**: ₹{one_year:,} (covers gadgets or exam travel)\n"
            f"• **By graduation (3 years)**: ₹{three_years:,} in pure savings!\n\n"
            f"That's literally skipping just one cafe iced coffee or extra snacks every day."
        )

    elif "500" in msg_lower and "save" in msg_lower:
        reply = (
            f"Saving ₹500 more this month is totally doable! Here is a 3-step student game plan:\n\n"
            f"1. **Canteen swap**: Swap 4 cafe coffees/smoothies for campus tapri chai (Saves ~₹240).\n"
            f"2. **Transit optimization**: Use the student metro pass or walk short distances (Saves ~₹150).\n"
            f"3. **Cooling-off**: Delay one non-essential Amazon or Swiggy purchase by 48 hours (Saves ~₹200+)."
        )

    elif "shopping" in msg_lower:
        shopping_cap = max(0.0, remaining * 0.25)
        reply = (
            f"Based on your current remaining balance of ₹{remaining:.0f}, I recommend capping new shopping to "
            f"**₹{shopping_cap:.0f}** for the rest of this month. "
            f"Always run items through our 'AI Purchase Reality Check' before checkout!"
        )

    elif "running out" in msg_lower or "why" in msg_lower or "broke" in msg_lower:
        top_cats = summary.get("category_breakdown", [])
        top_cat_name = top_cats[0]["category"] if top_cats else "everyday spending"
        top_cat_amt = top_cats[0]["spent"] if top_cats else 0.0
        reply = (
            f"Let's look at the facts: Your top spending area this month is **{top_cat_name}** at ₹{top_cat_amt:.0f}. "
            f"Small UPI payments (₹30, ₹60, ₹120) sneak up quickly on college students. "
            f"Try checking your 'Safe Daily Spend' (currently ₹{daily_spend:.0f}/day) every morning to stay in control!"
        )

    else:
        reply = (
            f"Hey! I'm Finny, your student money buddy. Right now, your safe spending pace is **₹{daily_spend:.0f}/day** "
            f"with **₹{remaining:.0f}** left across {days_left} days. "
            f"Ask me anything: Can I afford an outing? How to save ₹500? Or should you buy that new gadget?"
        )

    return {
        "reply": reply,
        "quick_suggestions": [
            "Can I afford to go out this weekend?",
            "How can I save ₹500 more this month?",
            "What happens if I save ₹50 every day?",
            "Why am I running out of money so quickly?"
        ],
        "source": "smart_advisor"
    }


async def generate_monthly_insight(summary: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates an encouraging monthly summary insight with actionable advice.
    """
    remaining = summary.get("remaining_safe_spend", 0.0)
    spent = summary.get("total_expenses", 0.0)
    pocket_money = summary.get("pocket_money", 0.0)
    saved = summary.get("total_current_savings", 0.0)
    days_left = summary.get("days_left", 1)
    pace = summary.get("spending_pace_status", "healthy")

    prompt = f"""
    Write a 2-sentence encouraging monthly financial review for a student:
    Pocket money: ₹{pocket_money:.0f}, Spent: ₹{spent:.0f}, Saved: ₹{saved:.0f}, Remaining: ₹{remaining:.0f}, Pace: {pace}.
    Return JSON with 'headline', 'summary', and 2 'tips'.
    """

    # Rule-based fallback is instant and rock-solid
    if pace == "overspending":
        headline = "Pace Check: Let's slow down the burn rate"
        summary_text = (
            f"You've spent ₹{spent:.0f} of your ₹{pocket_money:.0f} pocket money. "
            f"With {days_left} days remaining, keeping daily spends under ₹{summary.get('safe_daily_spend', 0):.0f} will keep you safe."
        )
        tips = [
            "Check your Food & Canteen spend — small ₹40 treats add up rapidly.",
            "Use the Cooling-off Wishlist for any online purchase over ₹200."
        ]
    elif pace == "caution":
        headline = "Steady As She Goes: You're in good shape"
        summary_text = (
            f"You've maintained steady habits with ₹{remaining:.0f} remaining. "
            f"You are on track to close the month without borrowing!"
        )
        tips = [
            f"Lock in ₹200 into your Savings Goal right now before the month ends.",
            "Track everyday UPI transactions right after paying at the stall."
        ]
    else:
        headline = "Budget Ninja: Fantastic money discipline!"
        summary_text = (
            f"Superb work! You have ₹{remaining:.0f} safe spend remaining and ₹{saved:.0f} in savings. "
            f"You are living well within your college budget."
        )
        tips = [
            "Consider transferring your surplus pocket money into your Savings Goal.",
            "Celebrate your discipline with a mindful small treat!"
        ]

    return {
        "headline": headline,
        "summary": summary_text,
        "tips": tips,
        "source": "smart_advisor"
    }
