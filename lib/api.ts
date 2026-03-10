import { DashboardData, Ticket, TicketDetail, TicketStatus } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function basicHeader(token: string): HeadersInit {
  return { Authorization: `Basic ${token}`, "Content-Type": "application/json" };
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function fetchTickets(token: string, params: URLSearchParams) {
  const res = await fetch(`${API_URL}/api/tickets?${params.toString()}`, {
    headers: basicHeader(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return (await res.json()) as Ticket[];
}

export async function fetchTicket(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/tickets/${id}`, { headers: basicHeader(token) });
  if (!res.ok) throw new Error("Failed to fetch ticket");
  return (await res.json()) as TicketDetail;
}

export async function patchTicket(token: string, id: string, body: Partial<{status: TicketStatus; assigned_analyst: string; note: string;}>) {
  const res = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: "PATCH",
    headers: basicHeader(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update ticket");
}

export async function bulkAssign(token: string, ids: string[], assigned_analyst: string) {
  await fetch(`${API_URL}/api/tickets/bulk/assign`, { method: "POST", headers: basicHeader(token), body: JSON.stringify({ ids, assigned_analyst }) });
}

export async function bulkDelete(token: string, ids: string[]) {
  await fetch(`${API_URL}/api/tickets/bulk/delete`, { method: "POST", headers: basicHeader(token), body: JSON.stringify({ ids }) });
}

export async function fetchDashboard(token: string): Promise<DashboardData> {
  const res = await fetch(`${API_URL}/api/dashboard`, { headers: basicHeader(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}

export function createSocket(token: string): WebSocket {
  const wsBase = API_URL.replace("http://", "ws://").replace("https://", "wss://");
  return new WebSocket(`${wsBase}/ws?token=${token}`);
}
