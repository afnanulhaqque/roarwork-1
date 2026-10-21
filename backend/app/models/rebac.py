import uuid
from sqlalchemy import String, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.base import TimestampMixin

class RebacTuple(Base, TimestampMixin):
    """
    Stores relationship tuples for ReBAC authorization:
    (entity_type, entity_id) has (relation) on (object_type, object_id)
    E.g.: ('user', 'user_123', 'admin', 'organization', 'org_roarworks')
          ('user', 'user_456', 'assignee', 'tour_booking', 'booking_789')
          ('user', 'user_789', 'editor', 'blog_post', 'post_101')
    """
    __tablename__ = "rebac_tuples"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type: Mapped[str] = mapped_column(String(50), default="user", nullable=False)
    entity_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    relation: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # admin, manager, editor, viewer, assignee, member
    object_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # organization, tour_booking, blog_post, report, offering
    object_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)

    __table_args__ = (
        Index("ix_rebac_lookup", "entity_type", "entity_id", "relation", "object_type", "object_id"),
    )
