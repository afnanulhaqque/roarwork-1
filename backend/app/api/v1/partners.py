from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.partner import Partner
from app.models.user import User
from app.schemas.partner import PartnerCreate, PartnerUpdate, PartnerResponse
from app.api.deps import require_role

router = APIRouter(prefix="/partners", tags=["Partners & Clients"])

@router.get("", response_model=List[PartnerResponse])
async def list_partners(db: AsyncSession = Depends(get_db)):
    stmt = select(Partner).order_by(Partner.display_order.asc())
    res = await db.execute(stmt)
    return list(res.scalars().all())

@router.post("", response_model=PartnerResponse, status_code=status.HTTP_201_CREATED)
async def create_partner(
    body: PartnerCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    partner = Partner(**body.model_dump())
    db.add(partner)
    await db.commit()
    await db.refresh(partner)
    return partner

@router.patch("/{partner_id}", response_model=PartnerResponse)
async def update_partner(
    partner_id: str,
    body: PartnerUpdate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Partner).where(Partner.id == partner_id)
    res = await db.execute(stmt)
    partner = res.scalar_one_or_none()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(partner, k, v)

    await db.commit()
    await db.refresh(partner)
    return partner

@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_partner(
    partner_id: str,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Partner).where(Partner.id == partner_id)
    res = await db.execute(stmt)
    partner = res.scalar_one_or_none()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    await db.delete(partner)
    await db.commit()
