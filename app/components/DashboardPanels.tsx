import { Bucket, DashboardData } from "@/lib/types";

export default function DashboardPanels({ dashboard }: { dashboard: DashboardData }) {
  const block = (title: string, buckets: Bucket[] = []) => (
    <div className="rounded border border-slate-700 bg-slate-900 p-3">
      <h4 className="mb-2 text-sm font-semibold text-cyan-200">{title}</h4>
      {buckets.map((b) => (
        <div key={String(b.key)} className="flex justify-between border-b border-slate-800 py-1 text-xs">
          <span>{b.key}</span><span>{b.doc_count}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {block("Alerts per Agent", dashboard.alerts_per_agent?.buckets)}
      {block("Top Rules", dashboard.top_rules?.buckets)}
      {block("Severity Distribution", dashboard.severity_distribution?.buckets)}
      {block("Status Distribution", dashboard.status_distribution?.buckets)}
    </div>
  );
}
