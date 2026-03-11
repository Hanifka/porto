from typing import Any
import httpx
from .config import settings


class IndexerConnectionError(httpx.HTTPError):
    def __init__(self, urls: list[str], last_error: Exception | None = None) -> None:
        self.urls = urls
        self.last_error = last_error
        message = f"Cannot reach Wazuh Indexer. Tried: {', '.join(urls)}"
        super().__init__(message)


def _candidate_urls() -> list[str]:
    urls = [settings.indexer_url, *settings.indexer_fallback_urls]
    deduped: list[str] = []
    for url in urls:
        if url not in deduped:
            deduped.append(url)
    return deduped


async def _request(method: str, path: str, username: str, password: str, **kwargs: Any) -> httpx.Response:
    last_exc: Exception | None = None
    urls = _candidate_urls()

    async with httpx.AsyncClient(verify=settings.verify_ssl, timeout=30) as client:
        for base_url in urls:
            try:
                response = await client.request(
                    method,
                    f"{base_url}{path}",
                    auth=(username, password),
                    **kwargs,
                )
                return response
            except httpx.HTTPError as exc:
                last_exc = exc
                continue

    raise IndexerConnectionError(urls=urls, last_error=last_exc)


async def indexer_get(path: str, username: str, password: str) -> httpx.Response:
    return await _request("GET", path, username, password)


async def indexer_post(path: str, username: str, password: str, body: dict[str, Any]) -> httpx.Response:
    return await _request("POST", path, username, password, json=body)


async def indexer_post_ndjson(path: str, username: str, password: str, payload: str) -> httpx.Response:
    return await _request(
        "POST",
        path,
        username,
        password,
        content=payload,
        headers={"Content-Type": "application/x-ndjson"},
    )


async def indexer_delete(path: str, username: str, password: str) -> httpx.Response:
    return await _request("DELETE", path, username, password)
