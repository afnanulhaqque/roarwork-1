from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.rebac import RebacTuple
from app.schemas.rebac import (
    RebacCheckRequest,
    RebacCheckResponse,
    RebacTupleCreate,
    RebacTupleResponse
)
from app.api.deps import require_role, get_current_user
from app.services.rebac_service import RebacService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/rebac", tags=["ReBAC Authorization"])

@router.post("/check", response_model=RebacCheckResponse)
async def check_rebac_permission(
    body: RebacCheckRequest,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.id == body.user_id)
    res = await db.execute(stmt)
    target_user = res.scalar_one_or_none()
    
    allowed, reason = await RebacService.check_permission(
        db=db,
        user=target_user,
        action=body.action,
        resource_type=body.resource_type,
        resource_id=body.resource_id
    )

    return RebacCheckResponse(
        allowed=allowed,
        reason=reason,
        user_id=body.user_id,
        resource=f"{body.resource_type}:{body.resource_id}",
        action=body.action
    )

@router.get("/tuples", response_model=List[RebacTupleResponse])
async def list_rebac_tuples(
    entity_id: Optional[str] = Query(None),
    object_type: Optional[str] = Query(None),
    object_id: Optional[str] = Query(None),
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    tuples = await RebacService.list_tuples(
        db=db,
        entity_id=entity_id,
        object_type=object_type,
        object_id=object_id
    )
    return tuples

@router.post("/grant", response_model=RebacTupleResponse, status_code=status.HTTP_201_CREATED)
async def grant_rebac_relation(
    body: RebacTupleCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    t = await RebacService.grant(
        db=db,
        entity_id=body.entity_id,
        relation=body.relation,
        object_type=body.object_type,
        object_id=body.object_id,
        entity_type=body.entity_type
    )

    await AuditService.log_event(
        db=db,
        action="REBAC_GRANTED",
        resource_type="rebac_tuple",
        resource_id=t.id,
        user_id=current_user.id,
        details={
            "entity": f"{t.entity_type}:{t.entity_id}",
            "relation": t.relation,
            "object": f"{t.object_type}:{t.object_id}"
        }
    )
    return t

@router.post("/revoke", status_code=status.HTTP_200_OK)
async def revoke_rebac_relation(
    body: RebacTupleCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    revoked = await RebacService.revoke(
        db=db,
        entity_id=body.entity_id,
        relation=body.relation,
        object_type=body.object_type,
        object_id=body.object_id
    )
    if not revoked:
        raise HTTPException(status_code=404, detail="Tuple not found or already revoked")

    await AuditService.log_event(
        db=db,
        action="REBAC_REVOKED",
        resource_type="rebac_tuple",
        user_id=current_user.id,
        details={
            "entity_id": body.entity_id,
            "relation": body.relation,
            "object": f"{body.object_type}:{body.object_id}"
        }
    )
    return {"status": "revoked", "success": True}
