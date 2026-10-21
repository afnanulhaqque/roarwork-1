import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_rebac_public_permission_check(client: AsyncClient):
    response = await client.post("/api/v1/rebac/check", json={
        "user_id": "any_random_id",
        "action": "view",
        "resource_type": "offering",
        "resource_id": "hot-desk"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["allowed"] is True

@pytest.mark.asyncio
async def test_rebac_admin_permission_check(client: AsyncClient, admin_token: str):
    # Get admin user ID
    me_res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    admin_id = me_res.json()["id"]

    response = await client.post("/api/v1/rebac/check", json={
        "user_id": admin_id,
        "action": "delete",
        "resource_type": "tour_booking",
        "resource_id": "some_booking_id"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["allowed"] is True
    assert "super_admin" in data["reason"]

@pytest.mark.asyncio
async def test_rebac_grant_and_verify(client: AsyncClient, admin_token: str):
    import uuid
    dummy_user_id = str(uuid.uuid4())
    dummy_booking_id = str(uuid.uuid4())

    grant_res = await client.post(
        "/api/v1/rebac/grant",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "entity_type": "user",
            "entity_id": dummy_user_id,
            "relation": "assignee",
            "object_type": "tour_booking",
            "object_id": dummy_booking_id
        }
    )
    assert grant_res.status_code == 201
    tuple_data = grant_res.json()
    assert tuple_data["relation"] == "assignee"
    assert tuple_data["object_id"] == dummy_booking_id
