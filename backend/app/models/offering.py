import uuid
from sqlalchemy import String, Text, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.base import TimestampMixin

class Offering(Base, TimestampMixin):
    __tablename__ = "offerings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    tag: Mapped[str | None] = mapped_column(String(50), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    price_pkr: Mapped[int] = mapped_column(Integer, nullable=False)
    billing_period: Mapped[str] = mapped_column(String(30), default="/month", nullable=False)
    capacity: Mapped[str] = mapped_column(String(50), default="1 Person", nullable=False)
    shift_type: Mapped[str] = mapped_column(String(50), default="Flexible", nullable=False) # Day, Night, 24/7, Flexible
    
    features_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False) # JSON list of strings
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
