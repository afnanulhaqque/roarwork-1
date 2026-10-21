from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    slug: str = Field(..., min_length=3, max_length=255)
    excerpt: str = Field(..., min_length=10)
    content: str = Field(..., min_length=20)
    cover_image: str
    category: str = "INTERIOR"
    read_time: str = "5 mins read"
    published: bool = True

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    read_time: Optional[str] = None
    published: Optional[bool] = None

class BlogPostResponse(BlogPostBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    published_at: datetime
    author_id: Optional[str] = None
    author_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
