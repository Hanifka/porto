import { TicketDetail, TicketStatus } from "@/lib/types";

export default function InvestigationPanel({ detail, onSave }: { detail: TicketDetail; onSave: (payload: { status: TicketStatus; assigned_analyst: string; note: string }) => Promise<void> }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-900 p-4">
      <h3 className="mb-2 text-lg font-semibold text-cyan-300">Investigation Panel</h3>
      <p>Agent: {detail.agent?.name}</p>
      <p>Rule: {detail.rule?.description}</p>
      <p>Groups: {detail.rule?.groups?.join(", ")}</p>
      <p>MITRE: {detail.rule?.mitre?.id?.join(", ")}</p>
      <p>Rule ID: {detail.rule?.id} / Fired: {detail.rule?.firedtimes}</p>
      <pre className="mt-2 max-h-52 overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(detail.full_log, null, 2)}</pre>
      <div className="mt-3 flex gap-2">
        <button className="rounded bg-cyan-500 px-3 py-1 text-slate-950" onClick={() => onSave({ status: "investigating", assigned_analyst: "", note: "Investigating" })}>Mark Investigating</button>
        <button className="rounded bg-emerald-500 px-3 py-1 text-slate-950" onClick={() => onSave({ status: "closed", assigned_analyst: "", note: "Closed" })}>Close</button>
      </div>
    </div>
  );
}
