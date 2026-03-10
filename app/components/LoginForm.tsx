"use client";

import { useState } from "react";

export default function LoginForm({ onLogin }: { onLogin: (token: string, username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto mt-32 max-w-md rounded-xl border border-cyan-500/30 bg-slate-950 p-8">
      <h1 className="mb-6 text-2xl font-bold text-cyan-200">SOC Ticketing Login</h1>
      <input className="mb-3 w-full rounded border border-slate-700 bg-slate-900 p-2" placeholder="Indexer username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="mb-3 w-full rounded border border-slate-700 bg-slate-900 p-2" type="password" placeholder="Indexer password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}
      <button
        className="w-full rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={submitting || !username || !password}
        onClick={async () => {
          try {
            setError("");
            setSubmitting(true);
            const token = btoa(`${username}:${password}`);
            await onLogin(token, username, password);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitting ? "Signing in..." : "Login"}
      </button>
    </div>
  );
}
