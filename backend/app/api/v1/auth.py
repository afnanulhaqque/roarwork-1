from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.redis import rate_limit
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate, UserResponse
from app.api.deps import get_current_user
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    # Rate limit login attempts to prevent brute-force attacks
    allowed = await rate_limit(f"login:{client_ip}", max_requests=10, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please wait a minute before trying again."
        )

    stmt = select(User).where(User.email == body.email.lower().strip())
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        await AuditService.log_event(
            db=db,
            action="LOGIN_FAILED",
            resource_type="auth",
            details={"email": body.email},
            ip_address=client_ip
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "org_id": user.organization_id
        }
    )

    await AuditService.log_event(
        db=db,
        action="LOGIN_SUCCESS",
        resource_type="auth",
        user_id=user.id,
        ip_address=client_ip
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: Request,
    body: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    allowed = await rate_limit(f"register:{client_ip}", max_requests=5, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Registration rate limit exceeded."
        )

    stmt = select(User).where(User.email == body.email.lower().strip())
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=body.email.lower().strip(),
        hashed_password=get_password_hash(body.password),
        full_name=body.full_name.strip(),
        phone=body.phone,
        role="member",
        is_active=True,
        organization_id=body.organization_id
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    await AuditService.log_event(
        db=db,
        action="USER_REGISTERED",
        resource_type="user",
        resource_id=user.id,
        user_id=user.id,
        ip_address=client_ip
    )
    return user
