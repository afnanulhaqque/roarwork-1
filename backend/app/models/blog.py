import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

class BlogPost(Base, TimestampMixin):
    __tablename__ = "blog_posts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str] = mapped_column(String(500), nullable=False)
    
    category: Mapped[str] = mapped_column(String(50), default="INTERIOR", index=True, nullable=False) # INTERIOR, FREELANCE, TIPS_TRICK, STARTUP, COMMUNITY
    read_time: Mapped[str] = mapped_column(String(30), default="5 mins read", nullable=False)
    
    published: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    author_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    author = relationship("User", back_populates="blog_posts")
