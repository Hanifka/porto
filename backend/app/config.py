from pydantic import BaseModel
import os


class Settings(BaseModel):
    indexer_url: str = os.getenv("INDEXER_URL", "https://127.0.0.1:9200")
    offense_index: str = os.getenv("OFFENSE_INDEX", "wazuh-offense")
    verify_ssl: bool = os.getenv("INDEXER_VERIFY_SSL", "false").lower() == "true"
    poll_interval_seconds: int = int(os.getenv("ALERT_POLL_INTERVAL", "5"))
    poll_username: str | None = os.getenv("INDEXER_POLL_USERNAME")
    poll_password: str | None = os.getenv("INDEXER_POLL_PASSWORD")


settings = Settings()
