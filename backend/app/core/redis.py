import time
from typing import Optional, Dict, Any, Tuple
import redis.asyncio as aioredis
from app.core.config import settings

class MemoryCacheFallback:
    """In-memory cache fallback when Redis instance is unreachable."""
    def __init__(self):
        self._store: Dict[str, Tuple[str, float]] = {}
        self._rate_limits: Dict[str, list[float]] = {}

    async def get(self, key: str) -> Optional[str]:
        if key in self._store:
            value, expires_at = self._store[key]
            if time.time() < expires_at:
                return value
            del self._store[key]
        return None

    async def set(self, key: str, value: str, ex: int = 300) -> bool:
        self._store[key] = (value, time.time() + ex)
        return True

    async def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False

    async def check_rate_limit(self, identifier: str, max_requests: int, window: int) -> bool:
        now = time.time()
        requests = self._rate_limits.get(identifier, [])
        # filter out requests older than window
        requests = [req for req in requests if now - req < window]
        if len(requests) >= max_requests:
            self._rate_limits[identifier] = requests
            return False
        requests.append(now)
        self._rate_limits[identifier] = requests
        return True

_memory_fallback = MemoryCacheFallback()
_redis_client: Optional[aioredis.Redis] = None
_redis_available: Optional[bool] = None

async def get_redis_client() -> Optional[aioredis.Redis]:
    global _redis_client, _redis_available
    if _redis_available is False:
        return None
    if _redis_client is None:
        try:
            _redis_client = aioredis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=1.0,
                socket_timeout=1.0
            )
            await _redis_client.ping()
            _redis_available = True
        except Exception:
            _redis_available = False
            _redis_client = None
    return _redis_client

async def get_cache(key: str) -> Optional[str]:
    try:
        client = await get_redis_client()
        if client:
            return await client.get(key)
    except Exception:
        pass
    return await _memory_fallback.get(key)

async def set_cache(key: str, value: str, expire_seconds: int = 300) -> bool:
    try:
        client = await get_redis_client()
        if client:
            await client.set(key, value, ex=expire_seconds)
            return True
    except Exception:
        pass
    return await _memory_fallback.set(key, value, ex=expire_seconds)

async def delete_cache(key: str) -> bool:
    try:
        client = await get_redis_client()
        if client:
            await client.delete(key)
            return True
    except Exception:
        pass
    return await _memory_fallback.delete(key)

async def rate_limit(identifier: str, max_requests: int = 15, window_seconds: int = 60) -> bool:
    """Return True if request is allowed, False if limit exceeded."""
    key = f"rate_limit:{identifier}"
    try:
        client = await get_redis_client()
        if client:
            current = await client.incr(key)
            if current == 1:
                await client.expire(key, window_seconds)
            return current <= max_requests
    except Exception:
        pass
    return await _memory_fallback.check_rate_limit(identifier, max_requests, window_seconds)

async def redis_health() -> Dict[str, Any]:
    try:
        client = await get_redis_client()
        if client:
            await client.ping()
            return {"status": "connected", "mode": "redis"}
    except Exception:
        pass
    return {"status": "active", "mode": "in_memory_fallback"}
