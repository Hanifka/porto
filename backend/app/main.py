from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .indexer import indexer_delete, indexer_get, indexer_post, indexer_post_ndjson
from .models import (
    AuthLoginRequest,
    BulkAssignRequest,
    BulkDeleteRequest,
    BulkStatusRequest,
    TicketUpdateRequest,
)
from .security import decode_basic_auth, get_user_credentials
from .ws import WebsocketHub

app = FastAPI(title="Wazuh SOC Ticketing API")
hub = WebsocketHub()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def verify_credentials(username: str, password: str) -> dict:
    response = await indexer_get("/_plugins/_security/authinfo", username, password)
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Wazuh Indexer credentials")
    return response.json()


@app.post("/api/auth/login")
async def login(body: AuthLoginRequest):
    authinfo = await verify_credentials(body.username, body.password)
    return {
        "ok": True,
        "username": body.username,
        "backend_roles": authinfo.get("backend_roles", []),
    }


@app.get("/api/auth/me")
async def auth_me(credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    authinfo = await verify_credentials(username, password)
    return {"username": username, "roles": authinfo.get("roles", [])}


@app.get("/api/tickets")
async def list_tickets(
    q: str | None = Query(default=None),
    severity_gte: int | None = Query(default=None),
    status: str | None = Query(default=None),
    size: int = Query(default=100, le=500),
    credentials: tuple[str, str] = Depends(get_user_credentials),
):
    username, password = credentials
    filters: list[dict] = []
    if severity_gte is not None:
        filters.append({"range": {"rule.level": {"gte": severity_gte}}})
    if status:
        filters.append({"term": {"soc.status.keyword": status}})

    must: list[dict] = []
    if q:
        must.append({"match": {"rule.description": {"query": q, "operator": "and"}}})

    query = {
        "size": size,
        "sort": [{"@timestamp": {"order": "desc"}}],
        "query": {"bool": {"filter": filters, "must": must}},
        "_source": [
            "@timestamp",
            "agent.name",
            "rule.description",
            "rule.level",
            "rule.id",
            "rule.groups",
            "rule.mitre",
            "rule.firedtimes",
            "full_log",
            "data",
            "soc.status",
            "soc.assigned_analyst",
            "soc.notes",
        ],
    }
    response = await indexer_post(f"/{settings.offense_index}/_search", username, password, query)
    response.raise_for_status()
    hits = response.json().get("hits", {}).get("hits", [])

    return [
        {
            "id": hit.get("_id"),
            "timestamp": hit.get("_source", {}).get("@timestamp"),
            "agent": hit.get("_source", {}).get("agent", {}).get("name"),
            "rule_description": hit.get("_source", {}).get("rule", {}).get("description"),
            "rule_level": hit.get("_source", {}).get("rule", {}).get("level"),
            "status": hit.get("_source", {}).get("soc", {}).get("status", "open"),
            "assigned_analyst": hit.get("_source", {}).get("soc", {}).get("assigned_analyst", ""),
        }
        for hit in hits
    ]


@app.get("/api/tickets/{ticket_id}")
async def ticket_detail(ticket_id: str, credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    response = await indexer_get(f"/{settings.offense_index}/_doc/{ticket_id}", username, password)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Ticket not found")
    src = response.json().get("_source", {})
    return {
        "id": ticket_id,
        "timestamp": src.get("@timestamp"),
        "agent": src.get("agent", {}),
        "rule": src.get("rule", {}),
        "mitre": src.get("rule", {}).get("mitre", {}),
        "full_log": src.get("full_log") or src.get("data"),
        "status": src.get("soc", {}).get("status", "open"),
        "assigned_analyst": src.get("soc", {}).get("assigned_analyst", ""),
        "notes": src.get("soc", {}).get("notes", []),
        "raw": src,
    }


@app.patch("/api/tickets/{ticket_id}")
async def update_ticket(
    ticket_id: str,
    body: TicketUpdateRequest,
    credentials: tuple[str, str] = Depends(get_user_credentials),
):
    username, password = credentials
    doc: dict = {}
    if body.status is not None:
        doc["soc.status"] = body.status
    if body.assigned_analyst is not None:
        doc["soc.assigned_analyst"] = body.assigned_analyst
    if body.note:
        doc["soc.last_note"] = body.note
        doc["soc.last_note_at"] = datetime.now(timezone.utc).isoformat()

    if not doc:
        raise HTTPException(status_code=400, detail="No update fields provided")

    response = await indexer_post(f"/{settings.offense_index}/_update/{ticket_id}", username, password, {"doc": doc})
    response.raise_for_status()

    await hub.broadcast("ticket.updated", {"id": ticket_id, "fields": doc})
    return {"updated": True, "id": ticket_id}


@app.post("/api/tickets/bulk/assign")
async def bulk_assign(body: BulkAssignRequest, credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    if not body.ids:
        raise HTTPException(status_code=400, detail="No IDs provided")
    lines = []
    for tid in body.ids:
        lines.append(json.dumps({"update": {"_index": settings.offense_index, "_id": tid}}))
        lines.append(json.dumps({"doc": {"soc.assigned_analyst": body.assigned_analyst}}))
    response = await indexer_post_ndjson("/_bulk", username, password, "\n".join(lines) + "\n")
    response.raise_for_status()
    await hub.broadcast("tickets.bulk_assigned", {"ids": body.ids, "assigned_analyst": body.assigned_analyst})
    return {"updated": len(body.ids)}


@app.post("/api/tickets/bulk/status")
async def bulk_status(body: BulkStatusRequest, credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    if not body.ids:
        raise HTTPException(status_code=400, detail="No IDs provided")
    lines = []
    for tid in body.ids:
        lines.append(json.dumps({"update": {"_index": settings.offense_index, "_id": tid}}))
        lines.append(json.dumps({"doc": {"soc.status": body.status}}))
    response = await indexer_post_ndjson("/_bulk", username, password, "\n".join(lines) + "\n")
    response.raise_for_status()
    await hub.broadcast("tickets.bulk_status", {"ids": body.ids, "status": body.status})
    return {"updated": len(body.ids)}


@app.post("/api/tickets/bulk/delete")
async def bulk_delete(body: BulkDeleteRequest, credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    if not body.ids:
        raise HTTPException(status_code=400, detail="No IDs provided")
    lines = [json.dumps({"delete": {"_index": settings.offense_index, "_id": tid}}) for tid in body.ids]
    response = await indexer_post_ndjson("/_bulk", username, password, "\n".join(lines) + "\n")
    response.raise_for_status()
    await hub.broadcast("tickets.bulk_deleted", {"ids": body.ids})
    return {"deleted": len(body.ids)}


@app.get("/api/dashboard")
async def dashboard(credentials: tuple[str, str] = Depends(get_user_credentials)):
    username, password = credentials
    body = {
        "size": 0,
        "aggs": {
            "alerts_per_agent": {"terms": {"field": "agent.name.keyword", "size": 10}},
            "top_rules": {"terms": {"field": "rule.description.keyword", "size": 10}},
            "severity_distribution": {"terms": {"field": "rule.level", "size": 16}},
            "status_distribution": {"terms": {"field": "soc.status.keyword", "missing": "open", "size": 4}},
        },
    }
    response = await indexer_post(f"/{settings.offense_index}/_search", username, password, body)
    response.raise_for_status()
    return response.json().get("aggregations", {})


async def poll_new_alerts() -> None:
    previous_latest: str | None = None
    while True:
        try:
            body = {
                "size": 1,
                "sort": [{"@timestamp": {"order": "desc"}}],
                "_source": ["@timestamp", "agent.name", "rule.description", "rule.level"],
            }
            service_user = settings.poll_username
            service_pass = settings.poll_password
            if service_user and service_pass:
                response = await indexer_post(f"/{settings.offense_index}/_search", service_user, service_pass, body)
                if response.status_code == 200:
                    hits = response.json().get("hits", {}).get("hits", [])
                    if hits:
                        latest = hits[0].get("_source", {}).get("@timestamp")
                        if previous_latest and latest != previous_latest:
                            await hub.broadcast("alerts.new", {"latest_timestamp": latest})
                        previous_latest = latest
        except Exception:
            pass
        await asyncio.sleep(settings.poll_interval_seconds)


@app.on_event("startup")
async def startup_event() -> None:
    asyncio.create_task(poll_new_alerts())


@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        username, password = decode_basic_auth(f"Basic {token}")
        await verify_credentials(username, password)
    except Exception:
        await websocket.close(code=4401)
        return

    await hub.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await hub.disconnect(websocket)
