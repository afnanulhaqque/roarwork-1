from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.seed import seed_initial_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    await init_db()
    # Seed initial demo data (admin, offerings, initial blogs, team, partners)
    await seed_initial_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack API backend for The Roarworks - Premium Coworking & Podcast Space, Blue Area, Islamabad.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "The Roarworks API",
        "version": "1.0.0",
        "location": settings.LOCATION_NAME
    }
