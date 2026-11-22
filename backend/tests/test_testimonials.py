import uuid
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_testimonials_admin_crud_and_public_visibility(client: AsyncClient, admin_token: str):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "name": f"Reviewer {uuid.uuid4().hex[:8]}",
        "role": "Workspace Member",
        "avatar": "https://example.com/avatar.jpg",
        "stars": 4,
        "content": "A useful review from an active workspace member.",
        "display_order": 99,
        "is_active": True,
    }

    unauthorized = await client.post("/api/v1/testimonials", json=payload)
    assert unauthorized.status_code == 401

    created = await client.post("/api/v1/testimonials", headers=headers, json=payload)
    assert created.status_code == 201
    testimonial_id = created.json()["id"]

    deactivated = await client.patch(
        f"/api/v1/testimonials/{testimonial_id}",
        headers=headers,
        json={"is_active": False},
    )
    assert deactivated.status_code == 200
    assert deactivated.json()["is_active"] is False

    public_items = await client.get("/api/v1/testimonials")
    admin_items = await client.get("/api/v1/testimonials?include_inactive=true", headers=headers)
    assert all(item["id"] != testimonial_id for item in public_items.json())
    assert any(item["id"] == testimonial_id for item in admin_items.json())

    deleted = await client.delete(f"/api/v1/testimonials/{testimonial_id}", headers=headers)
    assert deleted.status_code == 204
