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
    assert "Podcast Studio" in names
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
    assert data["price_pkr"] == 4000
    assert len(data["features"]) > 0
