import uuid
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

class TourBooking(Base, TimestampMixin):
    __tablename__ = "tour_bookings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    
    booking_type: Mapped[str] = mapped_column(String(50), default="Personal", nullable=False)  # Personal, Team, Enterprise, Podcast
    plan_interest: Mapped[str] = mapped_column(String(100), default="Hot Desk", nullable=False) # Hot Desk, Dedicated Desk, Private Office, Meeting Room, Podcast Studio, Night Shift
    start_date: Mapped[str | None] = mapped_column(String(30), nullable=True)
    end_date: Mapped[str | None] = mapped_column(String(30), nullable=True)
    preferred_time: Mapped[str | None] = mapped_column(String(50), default="Morning Shift", nullable=True)
    
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="NEW", index=True, nullable=False) # NEW, CONTACTED, TOUR_SCHEDULED, COMPLETED, CANCELLED
    terms_agreed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    assigned_to_user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_to = relationship("User", back_populates="assigned_bookings", foreign_keys=[assigned_to_user_id])
    
    organization_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
