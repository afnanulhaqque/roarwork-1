import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_root = Path(__file__).parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db
from app.seed import seed_initial_data

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    await init_db()
    await seed_initial_data()

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def admin_token(client: AsyncClient):
    res = await client.post("/api/v1/auth/login", json={
        "email": "admin@roarworks.com",
        "password": "Admin@Roarworks2026!"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest_asyncio.fixture
async def manager_token(client: AsyncClient):
    res = await client.post("/api/v1/auth/login", json={
        "email": "manager@roarworks.com",
        "password": "Manager@Roarworks2026!"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest_asyncio.fixture
async def staff_token(client: AsyncClient):
    res = await client.post("/api/v1/auth/login", json={
        "email": "staff@roarworks.com",
        "password": "Staff@Roarworks2026!"
    })
    assert res.status_code == 200
    return res.json()["access_token"]
