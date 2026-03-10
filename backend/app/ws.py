from fastapi import WebSocket
import asyncio
import json


class WebsocketHub:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self.lock:
            self.connections.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self.lock:
            self.connections.discard(websocket)

    async def broadcast(self, event: str, payload: dict) -> None:
        message = json.dumps({"event": event, "payload": payload})
        async with self.lock:
            current = list(self.connections)
        for connection in current:
            try:
                await connection.send_text(message)
            except Exception:
                await self.disconnect(connection)
