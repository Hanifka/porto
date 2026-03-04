"""Business logic for ticket CRUD in the `wazuh-tickets` index.

This service centralizes OpenSearch query shapes and update payloads.
"""

from __future__ import annotations

from typing import Any

from config import settings
from opensearch_client import get_opensearch_client

TICKET_LIST_FIELDS = [
    "timestamp",
    "agent_name",
    "rule_description",
    "rule_level",
    "src_ip",
    "status",
    "assigned_analyst",
]


def _build_filters(
    agent_name: str | None,
    src_ip: str | None,
    min_rule_level: int | None,
    status: str | None,
) -> list[dict[str, Any]]:
    """Build filter clauses for the ticket list query.

    Note: deliberately avoids `.keyword` fields per requirements.
    """

    filters: list[dict[str, Any]] = []

    if agent_name:
        filters.append({"match_phrase": {"agent_name": agent_name}})
    if src_ip:
        filters.append({"match_phrase": {"src_ip": src_ip}})
    if min_rule_level is not None:
        filters.append({"range": {"rule_level": {"gte": min_rule_level}}})
    if status:
        filters.append({"match_phrase": {"status": status}})

    return filters


def build_ticket_list_query(
    agent_name: str | None = None,
    src_ip: str | None = None,
    min_rule_level: int | None = None,
    status: str | None = None,
    page: int = 0,
    page_size: int = 50,
) -> dict[str, Any]:
    """Return the OpenSearch query body used for ticket list reads.

    Example output query body:
    {
      "from": 0,
      "size": 50,
      "_source": [...],
      "sort": [{"timestamp": {"order": "desc"}}],
      "query": {"bool": {"filter": [...]}}
    }
    """

    safe_size = min(max(page_size, 1), 50)
    from_offset = max(page, 0) * safe_size

    return {
        "from": from_offset,
        "size": safe_size,
        "_source": TICKET_LIST_FIELDS,
        "sort": [{"timestamp": {"order": "desc"}}],
        "query": {"bool": {"filter": _build_filters(agent_name, src_ip, min_rule_level, status)}},
    }


def list_tickets(
    agent_name: str | None = None,
    src_ip: str | None = None,
    min_rule_level: int | None = None,
    status: str | None = None,
    page: int = 0,
    page_size: int = 50,
) -> dict[str, Any]:
    """Read paginated tickets from OpenSearch."""

    client = get_opensearch_client()
    query_body = build_ticket_list_query(
        agent_name=agent_name,
        src_ip=src_ip,
        min_rule_level=min_rule_level,
        status=status,
        page=page,
        page_size=page_size,
    )
    return client.search(index=settings.index_name, body=query_body)


def get_ticket(ticket_id: str) -> dict[str, Any]:
    """Read one ticket document by id."""

    client = get_opensearch_client()
    response = client.get(index=settings.index_name, id=ticket_id)
    return response.get("_source", {})


def update_ticket(ticket_id: str, fields: dict[str, Any]) -> dict[str, Any]:
    """Partial update for ticket metadata like status, assignee, and notes."""

    client = get_opensearch_client()
    body = {"doc": fields}
    # Example update body: {"doc": {"status": "investigating", ...}}
    return client.update(index=settings.index_name, id=ticket_id, body=body, refresh=True)


def create_ticket(ticket_document: dict[str, Any], ticket_id: str | None = None) -> dict[str, Any]:
    """Create a ticket document (included for complete CRUD surface)."""

    client = get_opensearch_client()
    return client.index(index=settings.index_name, body=ticket_document, id=ticket_id, refresh=True)


def delete_ticket(ticket_id: str) -> dict[str, Any]:
    """Delete a ticket document by id (included for complete CRUD surface)."""

    client = get_opensearch_client()
    return client.delete(index=settings.index_name, id=ticket_id, refresh=True)
