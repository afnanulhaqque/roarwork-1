from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_optional_current_user, require_role
from app.core.database import get_db
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.testimonial import TestimonialCreate, TestimonialResponse, TestimonialUpdate

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=list[TestimonialResponse])
async def list_testimonials(
    include_inactive: bool = Query(False),
    current_user: User | None = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    if include_inactive and (not current_user or current_user.role not in ["super_admin", "workspace_manager"]):
        raise HTTPException(status_code=403, detail="Admin access required to view inactive testimonials")

    query = select(Testimonial)
    if not include_inactive:
        query = query.where(Testimonial.is_active.is_(True))
    result = await db.execute(query.order_by(Testimonial.display_order.asc()))
    return list(result.scalars().all())


@router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    body: TestimonialCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    testimonial = Testimonial(**body.model_dump())
    db.add(testimonial)
    await db.commit()
    await db.refresh(testimonial)
    return testimonial


@router.patch("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    body: TestimonialUpdate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    testimonial = await db.get(Testimonial, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    await db.commit()
    await db.refresh(testimonial)
    return testimonial


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_id: str,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    testimonial = await db.get(Testimonial, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await db.delete(testimonial)
    await db.commit()
