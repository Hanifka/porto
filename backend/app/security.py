from fastapi import Depends, Header, HTTPException
import base64


def decode_basic_auth(authorization: str | None) -> tuple[str, str]:
    if not authorization or not authorization.startswith("Basic "):
        raise HTTPException(status_code=401, detail="Missing basic auth")
    encoded = authorization.split(" ", 1)[1].strip()
    try:
        decoded = base64.b64decode(encoded).decode("utf-8")
        username, password = decoded.split(":", 1)
        return username, password
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid auth header") from exc


async def get_user_credentials(authorization: str | None = Header(default=None)) -> tuple[str, str]:
    return decode_basic_auth(authorization)
