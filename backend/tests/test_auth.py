import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", json={
        "email": "admin@roarworks.com",
        "password": "Admin@Roarworks2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@roarworks.com"
    assert data["user"]["role"] == "super_admin"

@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", json={
        "email": "admin@roarworks.com",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_me(client: AsyncClient, admin_token: str):
    response = await client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@roarworks.com"
    assert data["full_name"] == "Afnan Ul Haq"

@pytest.mark.asyncio
async def test_register_new_member(client: AsyncClient):
    import uuid
    random_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    response = await client.post("/api/v1/auth/register", json={
        "email": random_email,
        "password": "SecurePassword123!",
        "full_name": "Test Coworker",
        "phone": "+92 300 0000000"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == random_email
    assert data["role"] == "member"
