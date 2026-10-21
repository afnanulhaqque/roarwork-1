from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RebacTupleCreate(BaseModel):
    entity_type: str = "user"
    entity_id: str
    relation: str # admin, manager, editor, viewer, assignee, member
    object_type: str # organization, tour_booking, blog_post, report, offering
    object_id: str

class RebacCheckRequest(BaseModel):
    user_id: str
    action: str # view, edit, delete, manage, publish, assign
    resource_type: str
    resource_id: str

class RebacCheckResponse(BaseModel):
    allowed: bool
    reason: str
    user_id: str
    resource: str
    action: str

class RebacTupleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    entity_type: str
    entity_id: str
    relation: str
    object_type: str
    object_id: str
    created_at: datetime
