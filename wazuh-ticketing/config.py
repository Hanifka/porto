"""Application configuration for the Wazuh ticketing MVP.

Environment variables are optional overrides so this works in local dev,
containers, and production environments.
"""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """Runtime settings for OpenSearch and index access."""

    indexer_host: str = os.getenv("OPENSEARCH_HOST", "localhost")
    indexer_port: int = int(os.getenv("OPENSEARCH_PORT", "9200"))
    username: str = os.getenv("OPENSEARCH_USERNAME", "admin")
    password: str = os.getenv("OPENSEARCH_PASSWORD", "admin")
    index_name: str = os.getenv("WAZUH_TICKETS_INDEX", "wazuh-tickets")
    use_ssl: bool = os.getenv("OPENSEARCH_USE_SSL", "false").lower() == "true"
    verify_certs: bool = os.getenv("OPENSEARCH_VERIFY_CERTS", "false").lower() == "true"


settings = Settings()
