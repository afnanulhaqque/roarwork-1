import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_tour_booking_public(client: AsyncClient):
    payload = {
        "email": "visiting.creator@gmail.com",
        "full_name": "Hamza Tariq",
        "phone": "+92 333 1234567",
        "booking_type": "Podcast",
        "plan_interest": "Podcast Studio",
        "start_date": "2026-10-30",
        "preferred_time": "Morning Shift",
        "notes": "Need to record a demo episode with 2 guests.",
        "terms_agreed": True
    }
    response = await client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "whatsapp_link" in data
    assert "https://wa.me/" in data["whatsapp_link"]
    assert data["booking"]["full_name"] == "Hamza Tariq"
    assert data["booking"]["status"] == "NEW"

@pytest.mark.asyncio
async def test_list_bookings_authorized(client: AsyncClient, admin_token: str):
    response = await client.get("/api/v1/bookings", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert response.status_code == 200
    bookings = response.json()
    assert isinstance(bookings, list)
    assert len(bookings) >= 1

@pytest.mark.asyncio
async def test_list_bookings_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/bookings")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_update_booking_status(client: AsyncClient, admin_token: str):
    # Fetch first booking
    list_res = await client.get("/api/v1/bookings", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    bookings = list_res.json()
    assert len(bookings) > 0
    target_id = bookings[0]["id"]

    patch_res = await client.patch(
        f"/api/v1/bookings/{target_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"status": "TOUR_SCHEDULED", "notes": "Confirmed visit for 3 PM tomorrow"}
    )
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["status"] == "TOUR_SCHEDULED"
    assert updated["notes"] == "Confirmed visit for 3 PM tomorrow"
