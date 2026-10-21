import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.core.redis import get_cache, set_cache, delete_cache
from app.models.offering import Offering
from app.models.user import User
from app.schemas.offering import OfferingCreate, OfferingUpdate, OfferingResponse
from app.api.deps import require_role

router = APIRouter(prefix="/offerings", tags=["Offerings & Plans"])

def _to_response(o: Offering) -> OfferingResponse:
    features = []
    try:
        features = json.loads(o.features_json) if o.features_json else []
    except Exception:
        features = []
    return OfferingResponse(
        id=o.id,
        name=o.name,
        slug=o.slug,
        tag=o.tag,
        description=o.description,
        price_pkr=o.price_pkr,
        billing_period=o.billing_period,
        capacity=o.capacity,
        shift_type=o.shift_type,
        features=features,
        is_popular=o.is_popular,
        is_active=o.is_active,
        display_order=o.display_order,
        created_at=o.created_at,
        updated_at=o.updated_at
    )

@router.get("", response_model=List[OfferingResponse])
async def list_offerings(
    shift: Optional[str] = Query(None, description="Filter by shift: Day, Night, 24/7, Flexible"),
    include_inactive: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    cache_key = f"offerings:list:{shift}:{include_inactive}"
    cached = await get_cache(cache_key)
    if cached:
        try:
            raw_list = json.loads(cached)
            return [OfferingResponse(**item) for item in raw_list]
        except Exception:
            pass

    query = select(Offering)
    conditions = []
    if not include_inactive:
        conditions.append(Offering.is_active.is_(True))
    if shift and shift.lower() != "all":
        conditions.append(Offering.shift_type.ilike(f"%{shift}%"))

    if conditions:
        query = query.where(and_(*conditions))

    query = query.order_by(Offering.display_order.asc(), Offering.price_pkr.asc())
    res = await db.execute(query)
    offerings = res.scalars().all()
    responses = [_to_response(o) for o in offerings]

    # Cache for 10 minutes
    try:
        json_data = json.dumps([r.model_dump(mode="json") for r in responses])
        await set_cache(cache_key, json_data, expire_seconds=600)
    except Exception:
        pass

    return responses

@router.get("/{slug_or_id}", response_model=OfferingResponse)
async def get_offering(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Offering).where(
        (Offering.id == slug_or_id) | (Offering.slug == slug_or_id)
    )
    res = await db.execute(stmt)
    offering = res.scalar_one_or_none()
    if not offering:
        raise HTTPException(status_code=404, detail="Offering plan not found")
    return _to_response(offering)

@router.post("", response_model=OfferingResponse, status_code=status.HTTP_201_CREATED)
async def create_offering(
    body: OfferingCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    offering = Offering(
        name=body.name,
        slug=body.slug,
        tag=body.tag,
        description=body.description,
        price_pkr=body.price_pkr,
        billing_period=body.billing_period,
        capacity=body.capacity,
        shift_type=body.shift_type,
        features_json=json.dumps(body.features),
        is_popular=body.is_popular,
        is_active=body.is_active,
        display_order=body.display_order
    )
    db.add(offering)
    await db.commit()
    await db.refresh(offering)
    await delete_cache("offerings:list:None:False")
    return _to_response(offering)

@router.patch("/{offering_id}", response_model=OfferingResponse)
async def update_offering(
    offering_id: str,
    body: OfferingUpdate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Offering).where(Offering.id == offering_id)
    res = await db.execute(stmt)
    offering = res.scalar_one_or_none()
    if not offering:
        raise HTTPException(status_code=404, detail="Offering not found")

    if body.name is not None:
        offering.name = body.name
    if body.slug is not None:
        offering.slug = body.slug
    if body.tag is not None:
        offering.tag = body.tag
    if body.description is not None:
        offering.description = body.description
    if body.price_pkr is not None:
        offering.price_pkr = body.price_pkr
    if body.billing_period is not None:
        offering.billing_period = body.billing_period
    if body.capacity is not None:
        offering.capacity = body.capacity
    if body.shift_type is not None:
        offering.shift_type = body.shift_type
    if body.features is not None:
        offering.features_json = json.dumps(body.features)
    if body.is_popular is not None:
        offering.is_popular = body.is_popular
    if body.is_active is not None:
        offering.is_active = body.is_active
    if body.display_order is not None:
        offering.display_order = body.display_order

    await db.commit()
    await db.refresh(offering)
    await delete_cache("offerings:list:None:False")
    return _to_response(offering)
