from typing import Any
import httpx
from .config import settings


async def indexer_get(path: str, username: str, password: str) -> httpx.Response:
    async with httpx.AsyncClient(verify=settings.verify_ssl, timeout=20) as client:
        return await client.get(f"{settings.indexer_url}{path}", auth=(username, password))


async def indexer_post(path: str, username: str, password: str, body: dict[str, Any]) -> httpx.Response:
    async with httpx.AsyncClient(verify=settings.verify_ssl, timeout=30) as client:
        return await client.post(f"{settings.indexer_url}{path}", auth=(username, password), json=body)


async def indexer_post_ndjson(path: str, username: str, password: str, payload: str) -> httpx.Response:
    async with httpx.AsyncClient(verify=settings.verify_ssl, timeout=30) as client:
        return await client.post(
            f"{settings.indexer_url}{path}",
            auth=(username, password),
            content=payload,
            headers={"Content-Type": "application/x-ndjson"},
        )


async def indexer_delete(path: str, username: str, password: str) -> httpx.Response:
    async with httpx.AsyncClient(verify=settings.verify_ssl, timeout=20) as client:
        return await client.delete(f"{settings.indexer_url}{path}", auth=(username, password))
