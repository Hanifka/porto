"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardPanels from "./components/DashboardPanels";
import InvestigationPanel from "./components/InvestigationPanel";
import KpiCards from "./components/KpiCards";
import LoginForm from "./components/LoginForm";
import TicketsTable from "./components/TicketsTable";
import { bulkAssign, bulkDelete, createSocket, fetchDashboard, fetchTicket, fetchTickets, login, patchTicket } from "@/lib/api";
import { DashboardData, Ticket, TicketDetail } from "@/lib/types";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState(0);
  const [status, setStatus] = useState("all");
  const [uiError, setUiError] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    if (severity) p.set("severity_gte", String(severity));
    if (status !== "all") p.set("status", status);
    return p;
  }, [search, severity, status]);

  const refreshAll = useCallback(async (authToken: string) => {
    try {
      const [ticketsData, dashboardData] = await Promise.all([
        fetchTickets(authToken, params),
        fetchDashboard(authToken),
      ]);
      setUiError("");
      setTickets(ticketsData);
      setDashboard(dashboardData);
    } catch (err) {
      setUiError(err instanceof Error ? err.message : "Failed to refresh data");
    }
  }, [params]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      void refreshAll(token);
    }, 0);
    return () => clearTimeout(timer);
  }, [token, refreshAll]);

  useEffect(() => {
    if (!token) return;
    const ws = createSocket(token);
    ws.onmessage = () => {
      void refreshAll(token);
    };
    const timer = setInterval(() => ws.readyState === 1 && ws.send("ping"), 10000);
    return () => {
      clearInterval(timer);
      ws.close();
    };
  }, [token, refreshAll]);

  if (!token) {
    return <LoginForm onLogin={async (newToken, username, password) => { await login(username, password); setToken(newToken); }} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <h1 className="mb-4 text-2xl font-bold text-cyan-300">Wazuh SOC Ticketing Dashboard</h1>
      {uiError && <p className="mb-3 rounded border border-rose-500/50 bg-rose-950/40 p-2 text-sm text-rose-300">{uiError}</p>}
      <KpiCards tickets={tickets} />
      <div className="my-4 flex gap-2">
        <input className="rounded border border-slate-700 bg-slate-900 p-2" placeholder="Search description" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="w-28 rounded border border-slate-700 bg-slate-900 p-2" type="number" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
        <select className="rounded border border-slate-700 bg-slate-900 p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">all</option><option value="open">open</option><option value="investigating">investigating</option><option value="closed">closed</option>
        </select>
        <button className="rounded bg-indigo-500 px-3" onClick={() => selected.length && bulkAssign(token, selected, "tier1")}>Bulk Assign</button>
        <button className="rounded bg-rose-500 px-3" onClick={() => selected.length && bulkDelete(token, selected)}>Bulk Delete</button>
      </div>
      <TicketsTable tickets={tickets} selected={selected} setSelected={setSelected} openTicket={async (id) => setDetail(await fetchTicket(token, id))} />
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <DashboardPanels dashboard={dashboard} />
        {detail && <InvestigationPanel detail={detail} onSave={async (payload) => { await patchTicket(token, detail.id, payload); await refreshAll(token); }} />}
      </section>
    </main>
  );
}
