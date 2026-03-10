import { Ticket } from "@/lib/types";

export default function KpiCards({ tickets }: { tickets: Ticket[] }) {
  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    investigating: tickets.filter((t) => t.status === "investigating").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} className="rounded border border-slate-700 bg-slate-900 p-3">
          <p className="text-xs uppercase text-slate-400">{k}</p>
          <p className="text-xl font-bold text-cyan-300">{v}</p>
        </div>
      ))}
    </div>
  );
}
