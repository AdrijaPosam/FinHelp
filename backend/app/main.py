import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from .models import UserProfile
from .routers import profile, transactions, budget, ai, gamification

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("finhelp")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for FinHelp: Your AI-Powered Student Finance Buddy."
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(profile.router, prefix=settings.API_PREFIX)
app.include_router(transactions.router, prefix=settings.API_PREFIX)
app.include_router(budget.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(gamification.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def startup_event():
    logger.info("FinHelp API server starting up...")
    db = SessionLocal()
    try:
        user = db.query(UserProfile).first()
        if not user:
            logger.info("Initializing default user profile...")
            profile.get_or_create_default_user(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "app": "FinHelp API",
        "tagline": "Spend mindfully. Save happily.",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "ai_mode": "gemini" if settings.GEMINI_API_KEY else "smart_advisor",
        "ai_model": settings.AI_MODEL
    }
