from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete
from app.models.user import User
from app.models.rebac import RebacTuple

class RebacService:
    """
    Relationship-Based Access Control (ReBAC) Engine.
    Maps relationships (admin, manager, editor, viewer, assignee) 
    to actions (view, edit, delete, publish, assign) across resources.
    """
    RELATION_PERMISSIONS = {
        "admin": {"view", "edit", "delete", "publish", "assign", "manage", "create"},
        "manager": {"view", "edit", "publish", "assign", "create"},
        "editor": {"view", "edit", "publish"},
        "assignee": {"view", "edit", "update_status"},
        "viewer": {"view"},
        "member": {"view"},
    }

    @classmethod
    async def check_permission(
        cls,
        db: AsyncSession,
        user: Optional[User],
        action: str,
        resource_type: str,
        resource_id: str
    ) -> Tuple[bool, str]:
        """
        Evaluate if user has permission to perform action on resource.
        """
        # Public actions (e.g., viewing public offerings, blogs, team)
        if action == "view" and resource_type in {"offering", "blog_post", "team_member", "partner"}:
            return True, "Public resource view permitted"

        if not user:
            return False, "Authentication required for protected resource"

        # 1. Super Admin bypass
        if user.role == "super_admin":
            return True, "Authorized via super_admin system role"

        # 2. Workspace Manager role
        if user.role == "workspace_manager" and action in {"view", "edit", "publish", "assign", "create", "update_status"}:
            return True, "Authorized via workspace_manager role"

        # 3. Direct ReBAC tuple check on this specific resource
        stmt = select(RebacTuple).where(
            and_(
                RebacTuple.entity_id == user.id,
                RebacTuple.object_type == resource_type,
                RebacTuple.object_id == resource_id
            )
        )
        res = await db.execute(stmt)
        tuples = res.scalars().all()
        for t in tuples:
            allowed_actions = cls.RELATION_PERMISSIONS.get(t.relation, set())
            if action in allowed_actions:
                return True, f"Authorized via direct relation '{t.relation}' on {resource_type}"

        # 4. Check Organization-level ReBAC relationship if user belongs to an org
        if user.organization_id:
            org_stmt = select(RebacTuple).where(
                and_(
                    RebacTuple.entity_id == user.id,
                    RebacTuple.object_type == "organization",
                    RebacTuple.object_id == user.organization_id
                )
            )
            org_res = await db.execute(org_stmt)
            org_tuples = org_res.scalars().all()
            for ot in org_tuples:
                allowed_actions = cls.RELATION_PERMISSIONS.get(ot.relation, set())
                if action in allowed_actions:
                    return True, f"Authorized via org-level relation '{ot.relation}'"

        # 5. Wildcard global relation check (object_id == '*')
        wildcard_stmt = select(RebacTuple).where(
            and_(
                RebacTuple.entity_id == user.id,
                RebacTuple.object_type == resource_type,
                RebacTuple.object_id == "*"
            )
        )
        w_res = await db.execute(wildcard_stmt)
        w_tuples = w_res.scalars().all()
        for wt in w_tuples:
            allowed_actions = cls.RELATION_PERMISSIONS.get(wt.relation, set())
            if action in allowed_actions:
                return True, f"Authorized via wildcard relation '{wt.relation}'"

        return False, f"User {user.email} does not have '{action}' permission on {resource_type}:{resource_id}"

    @classmethod
    async def grant(
        cls,
        db: AsyncSession,
        entity_id: str,
        relation: str,
        object_type: str,
        object_id: str,
        entity_type: str = "user"
    ) -> RebacTuple:
        # Check existing
        stmt = select(RebacTuple).where(
            and_(
                RebacTuple.entity_type == entity_type,
                RebacTuple.entity_id == entity_id,
                RebacTuple.relation == relation,
                RebacTuple.object_type == object_type,
                RebacTuple.object_id == object_id
            )
        )
        res = await db.execute(stmt)
        existing = res.scalar_one_or_none()
        if existing:
            return existing

        new_tuple = RebacTuple(
            entity_type=entity_type,
            entity_id=entity_id,
            relation=relation,
            object_type=object_type,
            object_id=object_id
        )
        db.add(new_tuple)
        await db.commit()
        await db.refresh(new_tuple)
        return new_tuple

    @classmethod
    async def revoke(
        cls,
        db: AsyncSession,
        entity_id: str,
        relation: str,
        object_type: str,
        object_id: str
    ) -> bool:
        stmt = delete(RebacTuple).where(
            and_(
                RebacTuple.entity_id == entity_id,
                RebacTuple.relation == relation,
                RebacTuple.object_type == object_type,
                RebacTuple.object_id == object_id
            )
        )
        result = await db.execute(stmt)
        await db.commit()
        return result.rowcount > 0

    @classmethod
    async def list_tuples(
        cls,
        db: AsyncSession,
        entity_id: Optional[str] = None,
        object_type: Optional[str] = None,
        object_id: Optional[str] = None
    ) -> List[RebacTuple]:
        conditions = []
        if entity_id:
            conditions.append(RebacTuple.entity_id == entity_id)
        if object_type:
            conditions.append(RebacTuple.object_type == object_type)
        if object_id:
            conditions.append(RebacTuple.object_id == object_id)

        query = select(RebacTuple)
        if conditions:
            query = query.where(and_(*conditions))
        query = query.order_by(RebacTuple.created_at.desc())

        res = await db.execute(query)
        return list(res.scalars().all())
