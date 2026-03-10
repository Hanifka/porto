# Wazuh SOC Ticketing Platform

Lightweight SOC ticketing stack built on Wazuh alerts in `wazuh-offense`, using Wazuh Indexer (OpenSearch) as both datastore and authentication backend.

## Quick start

```bash
cp .env.example .env
# Optional: override if your Indexer is not local
# INDEXER_URL=https://127.0.0.1:9200

docker compose up -d --build
```

Open: `http://127.0.0.1:3000`

## Default service ports

- Frontend: `127.0.0.1:3000`
- Backend API/WebSocket: `127.0.0.1:8080`

Container services bind `0.0.0.0` inside each container, while Docker publishes only to host loopback (`127.0.0.1`).

## Environment variables

- `INDEXER_URL=https://127.0.0.1:9200` (override to your hosted Indexer endpoint when needed)
- `OFFENSE_INDEX=wazuh-offense`
- `INDEXER_VERIFY_SSL=false`
- `INDEXER_POLL_USERNAME` / `INDEXER_POLL_PASSWORD` (optional service account for new-alert polling)
- `NEXT_PUBLIC_API_URL=http://127.0.0.1:8080` (override as needed)

## Login troubleshooting

- If login says `Cannot reach API`, verify `soc-api` is up and port `8080` is reachable.
- If login says `Cannot reach Wazuh Indexer`, verify `INDEXER_URL` points to your hosted Indexer and is reachable from the API container.
- Test backend health quickly: `curl http://127.0.0.1:8080/api/health`

## Docs

- Full architecture, folder tree, query examples, components and deployment notes: `docs/ARCHITECTURE.md`
