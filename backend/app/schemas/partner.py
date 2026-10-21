from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class PartnerBase(BaseModel):
    name: str
    logo_url: str
    website_url: Optional[str] = None
    category: str = "Tech Startup"
    description: Optional[str] = None
    is_featured: bool = True
    display_order: int = 0

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None

class PartnerResponse(PartnerBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
