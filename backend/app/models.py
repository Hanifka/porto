from pydantic import BaseModel, Field
from typing import Literal


TicketStatus = Literal["open", "investigating", "closed"]


class AuthLoginRequest(BaseModel):
    username: str
    password: str


class TicketUpdateRequest(BaseModel):
    status: TicketStatus | None = None
    assigned_analyst: str | None = None
    note: str | None = None


class BulkAssignRequest(BaseModel):
    ids: list[str] = Field(default_factory=list)
    assigned_analyst: str


class BulkDeleteRequest(BaseModel):
    ids: list[str] = Field(default_factory=list)


class BulkStatusRequest(BaseModel):
    ids: list[str] = Field(default_factory=list)
    status: TicketStatus
