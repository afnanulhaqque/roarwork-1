from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TestimonialBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=150)
    avatar: str
    stars: int = Field(default=5, ge=1, le=5)
    content: str = Field(..., min_length=10)
    display_order: int = 0
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    role: str | None = Field(None, min_length=2, max_length=150)
    avatar: str | None = None
    stars: int | None = Field(None, ge=1, le=5)
    content: str | None = Field(None, min_length=10)
    display_order: int | None = None
    is_active: bool | None = None


class TestimonialResponse(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
