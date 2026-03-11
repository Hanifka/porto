from pydantic import BaseModel
import os


def _parse_fallback_urls() -> list[str]:
    raw = os.getenv(
        "INDEXER_FALLBACK_URLS",
        "https://host.docker.internal:9200,http://host.docker.internal:9200",
    )
    return [u.strip() for u in raw.split(",") if u.strip()]


class Settings(BaseModel):
    indexer_url: str = os.getenv("INDEXER_URL", "https://127.0.0.1:9200")
    indexer_fallback_urls: list[str] = _parse_fallback_urls()
    offense_index: str = os.getenv("OFFENSE_INDEX", "wazuh-offense")
    verify_ssl: bool = os.getenv("INDEXER_VERIFY_SSL", "false").lower() == "true"
    poll_interval_seconds: int = int(os.getenv("ALERT_POLL_INTERVAL", "5"))
    poll_username: str | None = os.getenv("INDEXER_POLL_USERNAME")
    poll_password: str | None = os.getenv("INDEXER_POLL_PASSWORD")


settings = Settings()
