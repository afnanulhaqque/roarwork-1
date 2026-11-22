import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_offerings_public(client: AsyncClient):
    response = await client.get("/api/v1/offerings")
    assert response.status_code == 200
    offerings = response.json()
    assert isinstance(offerings, list)
    assert len(offerings) >= 6

    # Verify Hot Desk and Podcast Studio exist
    names = [o["name"] for o in offerings]
    assert "Hot Desk" in names
    assert "Podcast Studio - No Equipment" in names
    assert "Dedicated Desk" in names

@pytest.mark.asyncio
async def test_filter_offerings_by_shift(client: AsyncClient):
    response = await client.get("/api/v1/offerings?shift=Night")
    assert response.status_code == 200
    offerings = response.json()
    assert isinstance(offerings, list)
    assert len(offerings) >= 1
    for o in offerings:
        assert "Night" in o["shift_type"] or o["shift_type"] == "Flexible"

@pytest.mark.asyncio
async def test_get_single_offering_by_slug(client: AsyncClient):
    response = await client.get("/api/v1/offerings/podcast-studio")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "podcast-studio"
    assert data["price_pkr"] == 9000
    assert len(data["features"]) > 0

@pytest.mark.asyncio
async def test_create_and_delete_offering(client: AsyncClient, admin_token: str):
    import uuid
    slug = f"admin-test-{uuid.uuid4().hex[:8]}"
    payload = {
        "name": "Admin CRUD Test",
        "slug": slug,
        "description": "A test offering created to verify admin lifecycle operations.",
        "price_pkr": 1000,
        "billing_period": "/hour",
        "capacity": "2 People",
        "shift_type": "Flexible",
        "features": ["Feature one"],
        "is_popular": False,
        "is_active": True,
        "display_order": 99,
    }
    headers = {"Authorization": f"Bearer {admin_token}"}
    created = await client.post("/api/v1/offerings", headers=headers, json=payload)
    assert created.status_code == 201
    offering_id = created.json()["id"]

    deleted = await client.delete(f"/api/v1/offerings/{offering_id}", headers=headers)
    assert deleted.status_code == 204
    missing = await client.get(f"/api/v1/offerings/{offering_id}")
    assert missing.status_code == 404
