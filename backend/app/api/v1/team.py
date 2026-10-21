from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.team import TeamMember
from app.models.user import User
from app.schemas.team import TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse
from app.api.deps import require_role

router = APIRouter(prefix="/team", tags=["Team Directory"])

@router.get("", response_model=List[TeamMemberResponse])
async def list_team_members(db: AsyncSession = Depends(get_db)):
    stmt = select(TeamMember).where(TeamMember.is_active.is_(True)).order_by(TeamMember.display_order.asc())
    res = await db.execute(stmt)
    return list(res.scalars().all())

@router.post("", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def create_team_member(
    body: TeamMemberCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    member = TeamMember(**body.model_dump())
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member

@router.patch("/{member_id}", response_model=TeamMemberResponse)
async def update_team_member(
    member_id: str,
    body: TeamMemberUpdate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TeamMember).where(TeamMember.id == member_id)
    res = await db.execute(stmt)
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(member, k, v)

    await db.commit()
    await db.refresh(member)
    return member

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_member(
    member_id: str,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TeamMember).where(TeamMember.id == member_id)
    res = await db.execute(stmt)
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    await db.delete(member)
    await db.commit()
