from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.offerings import router as offerings_router
from app.api.v1.blog import router as blog_router
from app.api.v1.team import router as team_router
from app.api.v1.partners import router as partners_router
from app.api.v1.rebac import router as rebac_router
from app.api.v1.stats import router as stats_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(bookings_router)
api_router.include_router(offerings_router)
api_router.include_router(blog_router)
api_router.include_router(team_router)
api_router.include_router(partners_router)
api_router.include_router(rebac_router)
api_router.include_router(stats_router)
