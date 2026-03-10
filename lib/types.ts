export type TicketStatus = "open" | "investigating" | "closed";

export interface Ticket {
  id: string;
  timestamp: string;
  agent: string;
  rule_description: string;
  rule_level: number;
  status: TicketStatus;
  assigned_analyst: string;
}

export interface TicketDetail {
  id: string;
  timestamp: string;
  agent: { name?: string; id?: string; ip?: string };
  rule: {
    id?: string;
    level?: number;
    description?: string;
    groups?: string[];
    firedtimes?: number;
    mitre?: { id?: string[]; tactic?: string[]; technique?: string[] };
  };
  full_log: unknown;
  status: TicketStatus;
  assigned_analyst: string;
  notes: string[];
  raw: unknown;
}

export interface Bucket { key: string | number; doc_count: number }

export interface DashboardData {
  alerts_per_agent?: { buckets: Bucket[] };
  top_rules?: { buckets: Bucket[] };
  severity_distribution?: { buckets: Bucket[] };
  status_distribution?: { buckets: Bucket[] };
}
