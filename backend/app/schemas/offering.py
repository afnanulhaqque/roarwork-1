from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class OfferingBase(BaseModel):
    name: str
    slug: str
    tag: Optional[str] = None
    description: str
    price_pkr: int = Field(..., ge=0)
    billing_period: str = "/month"
    capacity: str = "1 Person"
    shift_type: str = "Flexible"
    features: List[str] = []
    is_popular: bool = False
    is_active: bool = True
    display_order: int = 0

class OfferingCreate(OfferingBase):
    pass

class OfferingUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    price_pkr: Optional[int] = None
    billing_period: Optional[str] = None
    capacity: Optional[str] = None
    shift_type: Optional[str] = None
    features: Optional[List[str]] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class OfferingResponse(OfferingBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
