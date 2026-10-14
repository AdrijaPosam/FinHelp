# FinHelp — Your AI-Powered Student Finance Buddy 🎓💰

> **Tagline:** *"Spend mindfully. Save happily."*  
> **Target Audience:** College students and young adults managing pocket money and limited budgets.  
> **Default Currency:** Indian Rupee (₹)

---

## 🌟 Overview

**FinHelp** is a modern, responsive, and playful web application designed specifically for the financial realities of college life in India. Unlike standard corporate banking apps or intimidating spreadsheet software, FinHelp feels like a friendly, encouraging senior roommate who helps you manage canteen lunches, chai tapri runs, metro recharges, and shopping impulses—so you never run out of cash before the month ends.

---

## 🚀 Key Features

### 1. 🛡️ AI Purchase Reality Check (Signature Feature)
* **The Problem:** College students often buy impulsively on Amazon, Myntra, or Swiggy and experience immediate buyer's remorse.
* **The FinHelp Solution:** Enter any item name (e.g. *"Gaming Mouse"*, *"Designer Jacket"*), price, and whether it's a **Need**, **Want**, or **Uncertain** impulse.
* **Deterministic Analysis:** Rather than guessing, FinHelp calculates:
  * How much safe spend remains if you buy it.
  * Exactly how many **days of your safe daily allowance** it consumes (e.g., *"This jacket consumes 7.7 days of your entire food & living budget!"*).
  * An encouraging AI buddy reflection question to spark mindfulness.
* **48-Hour Cooling-Off Wishlist:** Park tempted buys for 24h, 48h, or 7 days. If you choose to skip it later, celebrate the money saved with celebratory confetti!

### 2. ⚡ Safe Daily Spend Engine
* Real-time dynamic daily limit: `Remaining Safe Spend ÷ Days Left in Month`.
* Calculates spending pace status (**Healthy Pace**, **Caution Pace**, **Overspending Alert**) so you always know if you're burning through cash faster than the calendar days.

### 3. 🤖 Ask Finny — Your AI Money Buddy
* An interactive conversational companion tailored for Indian college life.
* **Zero Math Hallucination:** Injects verified mathematical facts (pocket money, spent so far, days left, safe daily budget) directly into the AI prompt so Finny never hallucinates figures.
* **Dual-Engine Architecture:** Uses **Google Gemini API** (`gemini-1.5-flash`) when an API key is provided, or seamlessly switches to the built-in **Smart Student Advisor Engine** if no key is configured—guaranteeing 100% reliability for exhibitions and demos without broken screens!

### 4. 📊 Expense & Income Tracker with CSV Export
* Add, filter, and search everyday transactions: Canteen food, Metro transit, Books, Hostels, and Subscriptions.
* Filter by Category or Type (Expense, Income, Savings Deposit).
* Download full history in standard **CSV format** anytime.

### 5. 🎯 Savings Quest & Gamified Challenges
* Set multiple dream targets (e.g., *MacBook Upgrade*, *Goa Trip*, *Headphones*).
* Visual progress bars, milestone alerts, and one-tap "+ Stash Cash" deposits that sync directly with your transaction ledger.
* Complete student challenges (e.g., *"Chai & Snack Tracker"*, *"Impulse Shield"*) to earn achievement badges.

### 6. ☕ "What If I Save ₹50 a Day?" Simulator
* Interactive compound growth calculator showing how skipping just one cafe iced coffee or snack compounds:
  * **1 Month:** ₹1,500 (covers semester textbooks or phone/wifi recharge)
  * **6 Months:** ₹9,000 (covers noise-cancelling headphones)
  * **1 Year:** ₹18,250 (covers a college vacation or professional certification)
  * **Graduation (3 Years):** ₹54,750 in pure saved funds!

### 7. ⚖️ Spending Personality Badge
* Transparent, non-judgmental rule-based personality tagging:
  * **The Balanced Spender** ⚖️ (healthy, even distribution)
  * **The Canteen Connoisseur** ☕ (campus food & snack lover)
  * **The Goal Getter** 🚀 (saves >20% of pocket money)
  * **The Little Treat Lover** 🛍️ (frequent shopping or online orders)
  * **The Fresh Explorer** 🌱 (new financial journey)

---

## 🛠️ Technology Stack & Architectural Decisions

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript + Vite** | Blazing-fast development server, type-safety, and modular component architecture. |
| **Styling** | **Tailwind CSS v4** | Clean utility-first design with custom student palette: warm off-white, soft lavender, mint green, and dark mode support. |
| **Icons** | **Lucide React** | Consistent, lightweight, accessible icon set. |
| **Charts** | **Recharts** | Declarative, responsive SVG charting for donut category distributions and weekly trends. |
| **Backend** | **FastAPI (Python 3.13)** | Industry-standard async API framework, automatic interactive Swagger UI documentation at `/docs`, and native Python AI ecosystem. |
| **Database** | **SQLite via SQLAlchemy** | Zero-configuration local database persisted in `backend/finhelp.db`. Automatically creates tables on boot. |
| **AI Layer** | **Gemini API + Deterministic Fallback** | Hybrid dual-engine design ensuring the application never crashes even without third-party API credentials. |

---

## 📁 Project Directory Structure

```
d:/Finhelp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Configuration & environment variables
│   │   ├── database.py            # SQLite connection engine & session dependency
│   │   ├── models.py              # SQLAlchemy database tables (Profile, Transactions, Goals, Wishlist)
│   │   ├── schemas.py             # Pydantic request & response validation schemas
│   │   ├── calculations.py        # Core deterministic math engine (Safe Daily Spend, Pacing, Reality Check)
│   │   ├── ai_service.py          # Gemini LLM caller + Smart Student Advisor Fallback
│   │   ├── seed_data.py           # Realistic Indian college student demo dataset (Aarav Sharma)
│   │   ├── routers/
│   │   │   ├── profile.py         # Profile & Dashboard Summary endpoints
│   │   │   ├── transactions.py    # CRUD transactions & CSV export
│   │   │   ├── budget.py          # Category allocations & smart student recommendations
│   │   │   ├── ai.py              # Purchase Reality Check & Ask Finny chat
│   │   │   └── gamification.py    # Savings Goals, Badges, Challenges, and Wishlist
│   │   └── main.py                # FastAPI app initialization, CORS, and health checks
│   ├── tests/
│   │   └── test_calculations.py   # Pytest automated test suite for financial arithmetic
│   ├── requirements.txt           # Python backend dependencies
│   ├── finhelp.db                 # Local persistent SQLite database
│   └── .env.example               # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── types/index.ts         # Central TypeScript interfaces
│   │   ├── services/api.ts        # Type-safe API client
│   │   ├── context/
│   │   │   └── FinanceContext.tsx # Central state management & optimistic updates
│   │   ├── utils/
│   │   │   └── formatters.ts      # Rupee currency (₹), date formatting, and confetti animations
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer, Toast
│   │   │   ├── landing/           # Hero landing page & feature highlights
│   │   │   ├── onboarding/        # 3-Step student budget setup modal
│   │   │   ├── dashboard/         # StatCards, SafeDailyBanner, Category Chart, Weekly Trend
│   │   │   ├── tracker/           # Transaction table, search, category filters, CSV export
│   │   │   ├── planner/           # Pocket money allocation sliders & guidance
│   │   │   ├── ai/                # Purchase Reality Check & Ask Finny Drawer
│   │   │   ├── gamification/      # Savings goals, challenges, and badges
│   │   │   └── insights/          # Daily saver simulator & spending personality
│   │   ├── App.tsx                # Main view router
│   │   ├── main.tsx               # React root entry
│   │   └── index.css              # Custom Tailwind CSS theme styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

---

## ⚡ How to Run the Application

### Prerequisites
- **Node.js**: v18+ (Tested on Node v24)
- **Python**: 3.10+ (Tested on Python 3.13)

---

### Step 1: Start the Backend (FastAPI)

1. Open PowerShell or a Terminal and navigate to `backend`:
   ```powershell
   cd d:\Finhelp\backend
   ```
2. Activate the virtual environment:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   # (Or run directly with: .\venv\Scripts\python.exe -m uvicorn app.main:app --reload)
   ```
3. (Optional) Configure Gemini API Key:
   - Copy `.env.example` to `.env`:
     ```powershell
     cp .env.example .env
     ```
   - Add your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   *(Note: If you leave `GEMINI_API_KEY` blank, FinHelp automatically runs in **Smart Student Advisor Mode**, which provides intelligent, deterministic advice without needing any API key!)*

4. Start the backend server:
   ```powershell
   .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * The API will be active at: **`http://127.0.0.1:8000`**
   * Interactive Swagger API Docs at: **`http://127.0.0.1:8000/docs`**

---

### Step 2: Start the Frontend (Vite + React)

1. Open a second Terminal window and navigate to `frontend`:
   ```powershell
   cd d:\Finhelp\frontend
   ```
2. Start the development server:
   ```powershell
   npm.cmd run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### Step 3: Explore the App Like an Exhibition Judge!

1. On the top navigation bar, click the **"Load Demo Data"** button (with the green sparkle icon ✨).
2. Instantly, realistic Indian college expenses (Aarav's metro pass, canteen thali, tapri chai, college books, Spotify student plan) and laptop savings goals will populate!
3. Go to **"Reality Check"** and test what happens if you try to buy a ₹1,800 jacket. See the days of daily budget it consumes!
4. Go to **"Ask Finny"** and ask: *"Can I afford to go out this weekend?"*
5. Go to **"Smart Planner"** to adjust your category allocations interactively.

---

## 🧪 Automated Testing

We have built automated unit tests to verify all financial calculations, safe daily spend pacing, zero-income edge cases, and purchase reality check verdicts.

To run the test suite:
```powershell
cd d:\Finhelp\backend
.\venv\Scripts\python.exe -m pytest tests/
```
Output:
```
tests/test_calculations.py ..... [100%]
5 passed in 0.03s
```

---

## 🎓 Mentorship & Student Learning Notes

As you present this project at your college exhibition, here are the key technical concepts to highlight to your professors and evaluators:

1. **Why Math is Separated from the LLM:**
   * Large Language Models (LLMs) can easily make arithmetic mistakes or hallucinate numbers when asked to calculate percentages and balances.
   * In FinHelp, **100% of financial math** (safe daily spend, remaining balances, budget limits) is computed deterministically in Python (`calculations.py`). We pass verified, pre-computed numbers to the AI, ensuring complete reliability.

2. **Graceful Fallbacks (Resilience Engineering):**
   * If the student exhibits the project in a hall with poor WiFi or has no Gemini API key, the system never crashes or shows empty screens. The `ai_service.py` module detects missing credentials and activates the `Smart Student Advisor` rule engine.

3. **Database Normalization & SQLite:**
   * All transactions, goals, wishlist items, and budgets are tied to the user profile with foreign keys (`ForeignKey("user_profiles.id")`) and cascaded deletions.
   * SQLite is file-based and zero-setup, meaning you can copy the project folder to a laptop or pen drive and it runs immediately.

---

## 🤝 License & Author
Created for college students to build healthy, mindful financial habits early in life.  
**FinHelp — Spend mindfully. Save happily.**
