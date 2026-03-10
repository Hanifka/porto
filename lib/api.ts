import { DashboardData, Ticket, TicketDetail, TicketStatus } from "./types";

export function getApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    return `${protocol}//127.0.0.1:8080`;
  }

  return "http://127.0.0.1:8080";
}

function basicHeader(token: string): HeadersInit {
  return { Authorization: `Basic ${token}`, "Content-Type": "application/json" };
}

async function parseError(res: Response, fallback: string): Promise<Error> {
  try {
    const body = await res.json();
    return new Error(body?.detail ?? fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function login(username: string, password: string) {
  const apiUrl = getApiUrl();
  let res: Response;
  try {
    res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(`Cannot reach API at ${apiUrl}. Check soc-api container and port 8080.`);
  }
  if (!res.ok) throw await parseError(res, "Login failed");
  return res.json();
}

export async function fetchTickets(token: string, params: URLSearchParams) {
  const res = await fetch(`${getApiUrl()}/api/tickets?${params.toString()}`, {
    headers: basicHeader(token),
    cache: "no-store",
  });
  if (!res.ok) throw await parseError(res, "Failed to fetch tickets");
  return (await res.json()) as Ticket[];
}

export async function fetchTicket(token: string, id: string) {
  const res = await fetch(`${getApiUrl()}/api/tickets/${id}`, { headers: basicHeader(token) });
  if (!res.ok) throw await parseError(res, "Failed to fetch ticket");
  return (await res.json()) as TicketDetail;
}

export async function patchTicket(token: string, id: string, body: Partial<{ status: TicketStatus; assigned_analyst: string; note: string }>) {
  const res = await fetch(`${getApiUrl()}/api/tickets/${id}`, {
    method: "PATCH",
    headers: basicHeader(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res, "Failed to update ticket");
}

export async function bulkAssign(token: string, ids: string[], assigned_analyst: string) {
  const res = await fetch(`${getApiUrl()}/api/tickets/bulk/assign`, {
    method: "POST",
    headers: basicHeader(token),
    body: JSON.stringify({ ids, assigned_analyst }),
  });
  if (!res.ok) throw await parseError(res, "Bulk assign failed");
}

export async function bulkDelete(token: string, ids: string[]) {
  const res = await fetch(`${getApiUrl()}/api/tickets/bulk/delete`, {
    method: "POST",
    headers: basicHeader(token),
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw await parseError(res, "Bulk delete failed");
}

export async function fetchDashboard(token: string): Promise<DashboardData> {
  const res = await fetch(`${getApiUrl()}/api/dashboard`, { headers: basicHeader(token), cache: "no-store" });
  if (!res.ok) throw await parseError(res, "Failed to load dashboard");
  return res.json();
}

export function createSocket(token: string): WebSocket {
  const apiUrl = getApiUrl();
  const wsBase = apiUrl.replace("http://", "ws://").replace("https://", "wss://");
  return new WebSocket(`${wsBase}/ws?token=${token}`);
}
