# Wazuh SOC Ticketing Platform

Lightweight SOC ticketing stack built on Wazuh alerts in `wazuh-offense`, using Wazuh Indexer (OpenSearch) as both datastore and authentication backend.

## Quick start

```bash
cp .env.example .env
# REQUIRED: set your hosted indexer endpoint
# INDEXER_URL=https://your-indexer.example.com:9200

docker compose up -d --build
```

Open: `http://localhost:3000`

## Default service ports

- Frontend: `3000`
- Backend API/WebSocket: `8080`

## Environment variables

- `INDEXER_URL` (**required**) – your hosted Wazuh Indexer/OpenSearch URL (for example `https://10.10.10.20:9200`)
- `OFFENSE_INDEX=wazuh-offense`
- `INDEXER_VERIFY_SSL=false`
- `INDEXER_POLL_USERNAME` / `INDEXER_POLL_PASSWORD` (optional service account for new-alert polling)
- `NEXT_PUBLIC_API_URL` (optional override; by default UI auto-targets `http(s)://<current-host>:8080`)

## Login troubleshooting

- If login says `Cannot reach API`, verify `soc-api` is up and port `8080` is reachable.
- If login says `Cannot reach Wazuh Indexer`, verify `INDEXER_URL` points to your hosted Indexer and is reachable from the API container.
- Test backend health quickly: `curl http://<server>:8080/api/health`

## Docs

- Full architecture, folder tree, query examples, components and deployment notes: `docs/ARCHITECTURE.md`
