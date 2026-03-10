# Wazuh SOC Ticketing Platform

Lightweight SOC ticketing stack built on Wazuh alerts in `wazuh-offense`, using Wazuh Indexer (OpenSearch) as both datastore and authentication backend.

## Quick start

```bash
cp .env.example .env  # optional
docker compose up -d --build
```

Open: `http://localhost:3000`

## Default service ports

- Frontend: `3000`
- Backend API/WebSocket: `8080`

## Environment variables

- `INDEXER_URL=https://127.0.0.1:9200`
- `OFFENSE_INDEX=wazuh-offense`
- `INDEXER_VERIFY_SSL=false`
- `INDEXER_POLL_USERNAME` / `INDEXER_POLL_PASSWORD` (optional service account for new-alert polling)
- `NEXT_PUBLIC_API_URL` (optional override; by default UI auto-targets `http(s)://<current-host>:8080`)

## Docs

- Full architecture, folder tree, query examples, components and deployment notes: `docs/ARCHITECTURE.md`
