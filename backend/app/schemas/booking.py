from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class TourBookingCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    booking_type: str = Field(default="Personal", description="Personal, Team, Enterprise, Podcast")
    plan_interest: str = Field(default="Hot Desk", description="Hot Desk, Dedicated Desk, Private Office, Meeting Room, Podcast Studio, Night Shift")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    preferred_time: Optional[str] = "Morning Shift"
    notes: Optional[str] = None
    terms_agreed: bool = True

class TourBookingUpdate(BaseModel):
    status: Optional[str] = Field(None, description="NEW, CONTACTED, TOUR_SCHEDULED, COMPLETED, CANCELLED")
    assigned_to_user_id: Optional[str] = None
    notes: Optional[str] = None
    preferred_time: Optional[str] = None

class TourBookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    booking_type: str
    plan_interest: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    preferred_time: Optional[str] = None
    notes: Optional[str] = None
    status: str
    terms_agreed: bool
    assigned_to_user_id: Optional[str] = None
    organization_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
