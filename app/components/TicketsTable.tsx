import { Ticket } from "@/lib/types";

export default function TicketsTable({ tickets, selected, setSelected, openTicket }: {
  tickets: Ticket[];
  selected: string[];
  setSelected: (v: string[]) => void;
  openTicket: (id: string) => void;
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-slate-400">
        <tr>
          <th></th><th>Timestamp</th><th>Agent</th><th>Description</th><th>Level</th><th>Status</th><th>Assigned</th><th></th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id} className="border-t border-slate-800">
            <td><input type="checkbox" checked={selected.includes(t.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, t.id] : selected.filter((id) => id !== t.id))} /></td>
            <td>{new Date(t.timestamp).toLocaleString()}</td><td>{t.agent}</td><td>{t.rule_description}</td><td>{t.rule_level}</td><td>{t.status}</td><td>{t.assigned_analyst || "-"}</td>
            <td><button className="text-cyan-300" onClick={() => openTicket(t.id)}>Investigate</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
