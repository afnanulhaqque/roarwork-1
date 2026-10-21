from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, desc
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.blog import BlogPost
from app.models.user import User
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from app.api.deps import get_current_user, require_role
from app.services.rebac_service import RebacService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/blog", tags=["Blog & Editorial"])

def _to_blog_response(b: BlogPost) -> BlogPostResponse:
    author_name = "The Roarworks Editorial"
    if b.author:
        author_name = b.author.full_name
    return BlogPostResponse(
        id=b.id,
        title=b.title,
        slug=b.slug,
        excerpt=b.excerpt,
        content=b.content,
        cover_image=b.cover_image,
        category=b.category,
        read_time=b.read_time,
        published=b.published,
        published_at=b.published_at,
        author_id=b.author_id,
        author_name=author_name,
        created_at=b.created_at,
        updated_at=b.updated_at
    )

@router.get("", response_model=List[BlogPostResponse])
async def list_blog_posts(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    all_posts: bool = Query(False, description="Include unpublished (admin/staff only)"),
    limit: int = Query(30, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    query = select(BlogPost).options(selectinload(BlogPost.author))
    conditions = []

    if not all_posts:
        conditions.append(BlogPost.published.is_(True))

    if category and category.upper() != "ALL":
        conditions.append(BlogPost.category == category.upper())

    if search:
        s = f"%{search.strip()}%"
        conditions.append(
            or_(
                BlogPost.title.ilike(s),
                BlogPost.excerpt.ilike(s),
                BlogPost.content.ilike(s)
            )
        )

    if conditions:
        query = query.where(and_(*conditions))

    query = query.order_by(desc(BlogPost.published_at)).offset(offset).limit(limit)
    res = await db.execute(query)
    posts = res.scalars().all()
    return [_to_blog_response(p) for p in posts]

@router.get("/{slug}", response_model=BlogPostResponse)
async def get_blog_post(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(BlogPost)
        .options(selectinload(BlogPost.author))
        .where((BlogPost.slug == slug) | (BlogPost.id == slug))
    )
    res = await db.execute(stmt)
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return _to_blog_response(post)

@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    body: BlogPostCreate,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager", "staff"])),
    db: AsyncSession = Depends(get_db)
):
    # Check slug uniqueness
    stmt = select(BlogPost).where(BlogPost.slug == body.slug)
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A post with this slug already exists.")

    post = BlogPost(
        title=body.title.strip(),
        slug=body.slug.strip().lower(),
        excerpt=body.excerpt.strip(),
        content=body.content,
        cover_image=body.cover_image,
        category=body.category.upper(),
        read_time=body.read_time,
        published=body.published,
        published_at=datetime.now(timezone.utc),
        author_id=current_user.id
    )
    db.add(post)
    await db.commit()
    
    # Reload with author
    stmt = select(BlogPost).options(selectinload(BlogPost.author)).where(BlogPost.id == post.id)
    post = (await db.execute(stmt)).scalar_one()

    # ReBAC: Grant creator editor relation on this blog post
    await RebacService.grant(
        db=db,
        entity_id=current_user.id,
        relation="editor",
        object_type="blog_post",
        object_id=post.id
    )

    await AuditService.log_event(
        db=db,
        action="BLOG_POST_CREATED",
        resource_type="blog_post",
        resource_id=post.id,
        user_id=current_user.id,
        details={"title": post.title, "slug": post.slug}
    )

    return _to_blog_response(post)

@router.patch("/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    body: BlogPostUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BlogPost).options(selectinload(BlogPost.author)).where(BlogPost.id == post_id)
    res = await db.execute(stmt)
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    # ReBAC permission check
    allowed, reason = await RebacService.check_permission(
        db=db,
        user=current_user,
        action="edit",
        resource_type="blog_post",
        resource_id=post.id
    )
    if not allowed and post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail=reason)

    if body.title is not None:
        post.title = body.title
    if body.slug is not None:
        post.slug = body.slug.lower()
    if body.excerpt is not None:
        post.excerpt = body.excerpt
    if body.content is not None:
        post.content = body.content
    if body.cover_image is not None:
        post.cover_image = body.cover_image
    if body.category is not None:
        post.category = body.category.upper()
    if body.read_time is not None:
        post.read_time = body.read_time
    if body.published is not None:
        post.published = body.published

    await db.commit()
    await db.refresh(post)

    await AuditService.log_event(
        db=db,
        action="BLOG_POST_UPDATED",
        resource_type="blog_post",
        resource_id=post.id,
        user_id=current_user.id
    )

    return _to_blog_response(post)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: str,
    current_user: User = Depends(require_role(["super_admin", "workspace_manager"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BlogPost).where(BlogPost.id == post_id)
    res = await db.execute(stmt)
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    await db.delete(post)
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="BLOG_POST_DELETED",
        resource_type="blog_post",
        resource_id=post_id,
        user_id=current_user.id
    )
