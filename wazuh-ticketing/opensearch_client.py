"""Reusable OpenSearch client factory.

Separated from Streamlit/UI logic so this module can be reused by a future
FastAPI service without refactoring internals.
"""

from opensearchpy import OpenSearch

from config import settings


def get_opensearch_client() -> OpenSearch:
    """Return a configured OpenSearch client for Wazuh Indexer."""

    return OpenSearch(
        hosts=[{"host": settings.indexer_host, "port": settings.indexer_port}],
        http_auth=(settings.username, settings.password),
        use_ssl=settings.use_ssl,
        verify_certs=settings.verify_certs,
        ssl_assert_hostname=False,
        ssl_show_warn=False,
        timeout=30,
        max_retries=3,
        retry_on_timeout=True,
    )
