import uuid
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default="member", nullable=False)  # super_admin, workspace_manager, staff, member
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    organization_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    organization = relationship("Organization", back_populates="users")
    
    assigned_bookings = relationship("TourBooking", back_populates="assigned_to", foreign_keys="TourBooking.assigned_to_user_id")
    blog_posts = relationship("BlogPost", back_populates="author")
