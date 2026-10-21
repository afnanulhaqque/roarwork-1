import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    PROJECT_NAME: str = "The Roarworks Coworking API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./roarworks.db"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "roarworks-super-secret-jwt-key-2026-bluearea-islamabad")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]
    
    # Roarworks Brand Info & Notifications
    LOCATION_NAME: str = "The Roarworks, Blue Area, Islamabad"
    CONTACT_PHONE: str = "+923275277725"
    WHATSAPP_NUMBER: str = "+923275277725"
    CONTACT_EMAIL: str = "info@theroarworks.com"
    INSTAGRAM_URL: str = "https://www.instagram.com/theroarworks/"
    LINKEDIN_URL: str = "https://www.linkedin.com/company/theroarworks/"
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "info@theroarworks.com")
    ADMIN_DEFAULT_PASSWORD: str = os.getenv("ADMIN_DEFAULT_PASSWORD", "Admin@Roarworks2026!")

settings = Settings()
