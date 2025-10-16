# backend/app/main.py
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.api.routers import auth, cases, documents, hearings, payments, users

# Database + Models
from app.database import Base, engine, SessionLocal
from app.models import User
from app.core.security import hash_password

# ---------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------
# ✅ Database Initialization
# ---------------------------------------------------------------------
# Automatically create all database tables if they don't exist
Base.metadata.create_all(bind=engine)
logger.info("✅ Database tables ensured (created if missing).")


def seed_users():
    """
    Seed default system users if they don't already exist.
    Only runs once at startup.
    """
    db = SessionLocal()
    defaults = [
        {"email": "civilian@courts.com", "password": "ci1234", "role": "CIVILIAN"},
        {"email": "prosecutor@courts.com", "password": "po1234", "role": "PROSECUTOR"},
        {"email": "judge@courts.com", "password": "ju1234", "role": "JUDGE"},
        {"email": "registrar@courts.com", "password": "re1234", "role": "REGISTRAR"},
    ]

    for user in defaults:
        exists = db.query(User).filter(User.email == user["email"]).first()
        if not exists:
            logger.info(f"Seeding user: {user['email']} ({user['role']})")
            db.add(
                User(
                    email=user["email"],
                    password_hash=hash_password(user["password"]),
                    role=user["role"],
                )
            )

    db.commit()
    db.close()
    logger.info("✅ Default users seeded successfully.")


# ---------------------------------------------------------------------
# ⚙️ Lifespan context (modern startup/shutdown management)
# ---------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events cleanly.
    - Creates DB tables
    - Seeds default users
    """
    logger.info("🚀 Starting JIRAMS backend...")
    seed_users()
    yield
    logger.info("🛑 Shutting down JIRAMS backend...")


# ---------------------------------------------------------------------
# Initialize FastAPI app
# ---------------------------------------------------------------------
app = FastAPI(
    title="JIRAMS (Judicial Records & Management System)",
    version="1.0.0",
    description="Backend API for the Judicial Information and Records Management System",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------
# 🌐 Enhanced CORS Configuration
# ---------------------------------------------------------------------
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:5173",  # Vite / React default
    "https://localhost:3000",
    "https://localhost:3001",
    "https://127.0.0.1:3000",
    "https://127.0.0.1:3001",
    "https://localhost:5173",
    # Production front-ends (edit as needed)
    "https://your-frontend-domain.com",
    "https://your-frontend.vercel.app",
    "https://your-frontend.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# 🔗 Include Routers
# ---------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(hearings.router)
app.include_router(payments.router)
app.include_router(users.router)

# ---------------------------------------------------------------------
# 🩺 Root Endpoint (Health Check)
# ---------------------------------------------------------------------
@app.get("/", tags=["Root"])
def root():
    """
    Health-check route — confirms that the backend is running.
    """
    return {
        "status": "✅ OK",
        "message": "JIRAMS Backend API is running",
        "version": "1.0.0",
    }
