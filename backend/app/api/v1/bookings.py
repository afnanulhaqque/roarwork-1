from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, desc
from app.core.database import get_db
from app.core.redis import rate_limit
from app.models.booking import TourBooking
from app.models.user import User
from app.schemas.booking import TourBookingCreate, TourBookingUpdate, TourBookingResponse
from app.api.deps import get_current_user, require_role
from app.services.rebac_service import RebacService
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/bookings", tags=["Tour Bookings & Enquiries"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_tour_booking(
    request: Request,
    body: TourBookingCreate,
    db: AsyncSession = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    # Rate limit public submissions to protect from spam
    allowed = await rate_limit(f"booking_submit:{client_ip}", max_requests=6, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many tour requests sent. Please try again in a few minutes or message us on WhatsApp directly."
        )

    booking = TourBooking(
        email=body.email.lower().strip(),
        full_name=body.full_name.strip(),
        phone=body.phone,
        booking_type=body.booking_type,
        plan_interest=body.plan_interest,
        start_date=body.start_date,
        end_date=body.end_date,
        preferred_time=body.preferred_time,
        notes=body.notes,
        status="NEW",
        terms_agreed=body.terms_agreed
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)

    # Dispatch alerts
    booking_dict = {
        "id": booking.id,
        "full_name": booking.full_name,
        "email": booking.email,
        "phone": booking.phone,
        "plan_interest": booking.plan_interest,
        "booking_type": booking.booking_type,
        "start_date": booking.start_date
    }
    alert_info = await NotificationService.dispatch_new_booking_alert(booking_dict)

    await AuditService.log_event(
        db=db,
        action="TOUR_BOOKING_CREATED",
        resource_type="tour_booking",
        resource_id=booking.id,
        details={"plan": booking.plan_interest, "type": booking.booking_type},
        ip_address=client_ip
    )

    return {
        "success": True,
        "message": "Tour booking received! Our Blue Area community team will reach out within one hour.",
        "booking": TourBookingResponse.model_validate(booking),
        "whatsapp_link": alert_info["whatsapp_link"]
    }

@router.get("", response_model=List[TourBookingResponse])
async def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(require_role(["super_admin", "workspace_manager", "staff"])),
    db: AsyncSession = Depends(get_db)
):
    query = select(TourBooking)
    conditions = []
    
    if status_filter and status_filter.upper() != "ALL":
        conditions.append(TourBooking.status == status_filter.upper())
    
    if search:
        search_term = f"%{search.strip()}%"
        conditions.append(
            or_(
                TourBooking.full_name.ilike(search_term),
                TourBooking.email.ilike(search_term),
                TourBooking.phone.ilike(search_term),
                TourBooking.plan_interest.ilike(search_term)
            )
        )
    
    # If staff, check if restricted or assigned
    if current_user.role == "staff":
        # Staff can view bookings assigned to them or unassigned
        conditions.append(
            or_(
                TourBooking.assigned_to_user_id == current_user.id,
                TourBooking.assigned_to_user_id.is_(None)
            )
        )

    if conditions:
        query = query.where(and_(*conditions))

    query = query.order_by(desc(TourBooking.created_at)).offset(offset).limit(limit)
    res = await db.execute(query)
    bookings = res.scalars().all()
    return bookings

@router.get("/{booking_id}", response_model=TourBookingResponse)
async def get_booking_detail(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TourBooking).where(TourBooking.id == booking_id)
    res = await db.execute(stmt)
    booking = res.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ReBAC check
    allowed, reason = await RebacService.check_permission(
        db=db,
        user=current_user,
        action="view",
        resource_type="tour_booking",
        resource_id=booking.id
    )
    if not allowed and booking.assigned_to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail=reason)

    return booking

@router.patch("/{booking_id}", response_model=TourBookingResponse)
async def update_booking(
    booking_id: str,
    body: TourBookingUpdate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager", "staff"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TourBooking).where(TourBooking.id == booking_id)
    res = await db.execute(stmt)
    booking = res.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Staff can update only if assigned or unassigned
    if current_user.role == "staff" and booking.assigned_to_user_id and booking.assigned_to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Staff members cannot modify bookings assigned to other team members.")

    if body.status:
        booking.status = body.status.upper()
    if body.assigned_to_user_id is not None:
        booking.assigned_to_user_id = body.assigned_to_user_id
        # Grant ReBAC tuple to the assigned user
        if body.assigned_to_user_id:
            await RebacService.grant(
                db=db,
                entity_id=body.assigned_to_user_id,
                relation="assignee",
                object_type="tour_booking",
                object_id=booking.id
            )
    if body.notes is not None:
        booking.notes = body.notes
    if body.preferred_time is not None:
        booking.preferred_time = body.preferred_time

    await db.commit()
    await db.refresh(booking)

    await AuditService.log_event(
        db=db,
        action="BOOKING_UPDATED",
        resource_type="tour_booking",
        resource_id=booking.id,
        user_id=current_user.id,
        details={"status": booking.status, "assigned_to": booking.assigned_to_user_id}
    )

    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: str,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TourBooking).where(TourBooking.id == booking_id)
    res = await db.execute(stmt)
    booking = res.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    await db.delete(booking)
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="BOOKING_DELETED",
        resource_type="tour_booking",
        resource_id=booking_id,
        user_id=current_user.id
    )
