from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.redis import redis_health
from app.models.booking import TourBooking
from app.models.blog import BlogPost
from app.models.partner import Partner
from app.models.user import User
from app.api.deps import require_role

router = APIRouter(prefix="/stats", tags=["Dashboard Analytics"])

@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(require_role(["super_admin", "workspace_manager", "staff"])),
    db: AsyncSession = Depends(get_db)
):
    # Total bookings
    total_b_stmt = select(func.count(TourBooking.id))
    total_bookings = (await db.execute(total_b_stmt)).scalar() or 0

    # New bookings
    new_b_stmt = select(func.count(TourBooking.id)).where(TourBooking.status == "NEW")
    new_bookings = (await db.execute(new_b_stmt)).scalar() or 0

    # Scheduled tours
    sched_stmt = select(func.count(TourBooking.id)).where(TourBooking.status == "TOUR_SCHEDULED")
    scheduled_tours = (await db.execute(sched_stmt)).scalar() or 0

    # Completed tours
    completed_stmt = select(func.count(TourBooking.id)).where(TourBooking.status == "COMPLETED")
    completed_tours = (await db.execute(completed_stmt)).scalar() or 0

    # Total blogs
    blog_stmt = select(func.count(BlogPost.id))
    total_blogs = (await db.execute(blog_stmt)).scalar() or 0

    # Total partners
    partner_stmt = select(func.count(Partner.id))
    total_partners = (await db.execute(partner_stmt)).scalar() or 0

    # Status distribution
    status_stmt = select(TourBooking.status, func.count(TourBooking.id)).group_by(TourBooking.status)
    status_res = await db.execute(status_stmt)
    status_distribution = {row[0]: row[1] for row in status_res.all()}

    # Plan interest distribution
    plan_stmt = select(TourBooking.plan_interest, func.count(TourBooking.id)).group_by(TourBooking.plan_interest)
    plan_res = await db.execute(plan_stmt)
    plan_distribution = {row[0]: row[1] for row in plan_res.all()}

    # Redis health
    redis_info = await redis_health()

    conversion_rate = round((completed_tours / total_bookings * 100), 1) if total_bookings > 0 else 0.0

    return {
        "total_bookings": total_bookings,
        "new_bookings": new_bookings,
        "scheduled_tours": scheduled_tours,
        "completed_tours": completed_tours,
        "conversion_rate_percentage": conversion_rate,
        "total_blogs": total_blogs,
        "total_partners": total_partners,
        "status_distribution": status_distribution,
        "plan_distribution": plan_distribution,
        "redis_status": redis_info
    }
