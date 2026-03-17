"use client";

import { Shell } from "@/components/shell";
import { Sparkline } from "@/components/sparkline";
import { keys } from "@/lib/mock-data";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Active" },
  expiring: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Expiring" },
  revoked: { bg: "bg-red-500/10", text: "text-red-400", label: "Revoked" },
  "rate-limited": { bg: "bg-orange-500/10", text: "text-orange-400", label: "Rate Limited" },
};

const envColors: Record<string, string> = {
  production: "border-emerald-500/30 text-emerald-400",
  staging: "border-amber-500/30 text-amber-400",
  development: "border-blue-500/30 text-blue-400",
};

export default function DashboardPage() {
  const totalSpend = keys.reduce((s, k) => s + k.spendToday, 0);
  const totalRequests = keys.reduce((s, k) => s + k.requestsToday, 0);
  const activeKeys = keys.filter((k) => k.status === "active").length;

  return (
    <Shell>
      <div className="px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
              API Keys
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Manage, monitor, and secure your Claude API keys
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]">
            + Create Key
          </button>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard label="Today's Spend" value={`$${totalSpend.toFixed(2)}`} sub="across all keys" />
          <StatCard label="Requests" value={totalRequests.toLocaleString()} sub="today" />
          <StatCard label="Active Keys" value={String(activeKeys)} sub={`of ${keys.length} total`} />
          <StatCard label="Secrets Synced" value="4" sub="1Password, AWS, Doppler" accent />
        </div>

        {/* Keys Table */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_100px_80px_60px] gap-4 border-b border-[var(--border-subtle)] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
            <span>Key</span>
            <span>Value</span>
            <span>Spend Today</span>
            <span>Last Used</span>
            <span>Status</span>
            <span>14d Trend</span>
            <span></span>
          </div>

          {keys.map((key) => {
            const status = statusColors[key.status];
            const env = envColors[key.environment];
            const spendPct = key.spendLimit > 0 ? (key.spendToday / key.spendLimit) * 100 : 0;

            return (
              <div
                key={key.id}
                className="grid grid-cols-[2fr_1.2fr_1fr_1fr_100px_80px_60px] items-center gap-4 border-b border-[var(--border-subtle)] px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--bg-elevated)]/50"
              >
                {/* Name + env badge */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <path d="M10.5 1.5a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3z" />
                      <path d="M8.12 6.38 1.5 13v1.5H4l.75-.75v-1.5h1.5l.75-.75v-1.5h1.5l1.62-1.62" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{key.name}</div>
                    <span className={`inline-block mt-0.5 rounded border px-1.5 py-0 text-[10px] ${env}`}>
                      {key.environment}
                    </span>
                  </div>
                </div>

                {/* Masked value */}
                <code className="font-[var(--font-mono)] text-xs text-[var(--text-muted)]">
                  {key.prefix}
                </code>

                {/* Spend */}
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    ${key.spendToday.toFixed(2)}
                  </div>
                  <div className="mt-1 h-1 w-full max-w-[80px] rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: `${Math.min(spendPct, 100)}%`,
                        backgroundColor: spendPct > 80 ? "#ef4444" : spendPct > 60 ? "#f59e0b" : "var(--accent-primary)",
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-[var(--text-subtle)]">
                    of ${key.spendLimit}/day
                  </div>
                </div>

                {/* Last used */}
                <span className="text-sm text-[var(--text-muted)]">{key.lastUsed}</span>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${key.status === "active" ? "bg-emerald-400" : key.status === "expiring" ? "bg-amber-400" : key.status === "revoked" ? "bg-red-400" : "bg-orange-400"}`} />
                  {status.label}
                </span>

                {/* Sparkline */}
                <Sparkline
                  data={key.spendHistory}
                  color={key.status === "revoked" ? "var(--text-subtle)" : "var(--accent-primary)"}
                />

                {/* Actions */}
                <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</div>
    </div>
  );
}
