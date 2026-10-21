from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: str
    photo_url: str
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class TeamMemberResponse(TeamMemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
