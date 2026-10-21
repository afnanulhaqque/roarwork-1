import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_blog_posts_public(client: AsyncClient):
    response = await client.get("/api/v1/blog")
    assert response.status_code == 200
    posts = response.json()
    assert isinstance(posts, list)
    assert len(posts) >= 3

@pytest.mark.asyncio
async def test_get_blog_by_slug(client: AsyncClient):
    slug = "why-your-business-needs-a-virtual-office"
    response = await client.get(f"/api/v1/blog/{slug}")
    assert response.status_code == 200
    post = response.json()
    assert post["slug"] == slug
    assert "Blue Area" in post["content"]
    assert post["category"] == "INTERIOR"

@pytest.mark.asyncio
async def test_create_and_manage_blog_post(client: AsyncClient, admin_token: str):
    import uuid
    uid = uuid.uuid4().hex[:6]
    payload = {
        "title": f"Community Spotlight: Islamabad Creatives {uid}",
        "slug": f"community-spotlight-{uid}",
        "excerpt": "A deep dive into local freelancers making a global impact.",
        "content": "Full article content discussing coworking and community growth in Blue Area.",
        "cover_image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        "category": "COMMUNITY",
        "read_time": "4 mins read",
        "published": True
    }
    create_res = await client.post(
        "/api/v1/blog",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=payload
    )
    assert create_res.status_code == 201
    created_post = create_res.json()
    assert created_post["slug"] == payload["slug"]
