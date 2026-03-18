"use client";

import { Shell } from "@/components/shell";
import { Sparkline } from "@/components/sparkline";
import { keys, environments, team } from "@/lib/mock-data";

const statusColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: "bg-[hsl(97,59%,46%)]/10", text: "text-[hsl(97,59%,46%)]", dot: "bg-[hsl(97,59%,46%)]", label: "Active" },
  expiring: { bg: "bg-[hsl(40,71%,50%)]/10", text: "text-[hsl(40,71%,50%)]", dot: "bg-[hsl(40,71%,50%)]", label: "Expiring" },
  revoked: { bg: "bg-[hsl(0,98%,75%)]/10", text: "text-[hsl(0,98%,75%)]", dot: "bg-[hsl(0,98%,75%)]", label: "Revoked" },
  "rate-limited": { bg: "bg-[hsl(15,63%,60%)]/10", text: "text-[hsl(15,63%,60%)]", dot: "bg-[hsl(15,63%,60%)]", label: "Rate Limited" },
};

const envColors: Record<string, string> = {
  production: "border-[hsl(97,59%,46%)]/30 text-[hsl(97,59%,46%)]",
  staging: "border-[hsl(40,71%,50%)]/30 text-[hsl(40,71%,50%)]",
  development: "border-[hsl(210,66%,67%)]/30 text-[hsl(210,66%,67%)]",
};

export default function DashboardPage() {
  const totalAccesses = keys.reduce((s, k) => s + k.accessesToday, 0);
  const totalRequests = keys.reduce((s, k) => s + k.requestsToday, 0);
  const activeKeys = keys.filter((k) => k.status === "active").length;
  const rotatingKeys = keys.filter((k) => k.rotationSchedule && k.status !== "revoked");

  return (
    <Shell>
      <div className="px-8 py-6 max-w-[1200px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-000)]" style={{ fontFamily: "var(--font-serif)" }}>
              API Keys
            </h1>
            <p className="mt-1 text-sm text-[var(--text-400)]">
              Manage, monitor, and secure your Claude API keys
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
            + Create Key
          </button>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <StatCard label="Claude Accesses Today" value={totalAccesses.toLocaleString()} sub="across all keys" />
          <StatCard label="Active Keys" value={String(activeKeys)} sub={`of ${keys.length} total`} />
          <StatCard label="Team Members" value={String(team.length)} sub="with key access" />
          <StatCard label="Secrets Synced" value="3" sub="1Password, AWS" accent />
        </div>

        {/* Environments overview */}
        <div className="mb-6 rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-000)]">Environments</h2>
          <div className="grid grid-cols-3 gap-3">
            {environments.map((env) => {
              const envKeys = keys.filter((k) => k.environment === env.name);
              const envAccesses = envKeys.reduce((s, k) => s + k.accessesToday, 0);
              return (
                <div key={env.id} className="rounded-lg bg-[var(--bg-200)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: env.color }} />
                      <span className="text-sm font-medium text-[var(--text-000)]">{env.label}</span>
                    </div>
                    <span className="text-xs text-[var(--text-400)]">{envKeys.length} keys</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-400)]">{envAccesses.toLocaleString()} accesses today</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      env.approvalLevel === "cto" ? "bg-[hsl(0,98%,75%)]/10 text-[hsl(0,98%,75%)]" :
                      env.approvalLevel === "team-lead" ? "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]" :
                      "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]"
                    }`}>
                      {env.approvalLevel === "none" ? "Auto-approved" : `Requires ${env.approvalName}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keys Table */}
        <div className="mb-6 rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
          <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr_100px_80px_60px] gap-4 border-b-0.5 px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-500)]" style={{ borderColor: "var(--border-300)" }}>
            <span>Key</span>
            <span>Project</span>
            <span>Accesses Today</span>
            <span>Last Accessed</span>
            <span>Status</span>
            <span>14d Trend</span>
            <span></span>
          </div>

          {keys.map((key) => {
            const status = statusColors[key.status];
            const env = envColors[key.environment];
            const accessPct = key.accessLimit > 0 ? (key.accessesToday / key.accessLimit) * 100 : 0;

            return (
              <div
                key={key.id}
                className="grid grid-cols-[1.8fr_1fr_1fr_1fr_100px_80px_60px] items-center gap-4 border-b-0.5 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--bg-200)]"
                style={{ borderColor: "var(--border-300)" }}
              >
                {/* Name + env badge */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-300)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-400)" strokeWidth="1.5">
                      <path d="M10.5 1.5a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3z" />
                      <path d="M8.12 6.38 1.5 13v1.5H4l.75-.75v-1.5h1.5l.75-.75v-1.5h1.5l1.62-1.62" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-000)]">{key.name}</div>
                    <span className={`inline-block mt-0.5 rounded border-0.5 px-1.5 py-0 text-[10px] ${env}`}>
                      {key.environment}
                    </span>
                  </div>
                </div>

                {/* Project */}
                <span className="text-sm text-[var(--text-200)]">{key.project}</span>

                {/* Accesses */}
                <div>
                  <div className="text-sm font-medium text-[var(--text-000)]">
                    {key.accessesToday.toLocaleString()}
                  </div>
                  <div className="mt-1 h-1 w-full max-w-[80px] rounded-full bg-[var(--bg-300)]">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: `${Math.min(accessPct, 100)}%`,
                        backgroundColor: accessPct > 80 ? "hsl(0,98%,75%)" : accessPct > 60 ? "hsl(40,71%,50%)" : "var(--accent-brand)",
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-[var(--text-500)]">
                    of {key.accessLimit.toLocaleString()}/day
                  </div>
                </div>

                {/* Last accessed */}
                <div>
                  <span className="text-sm text-[var(--text-300)]">{key.lastUsed}</span>
                  <div className="text-[10px] text-[var(--text-500)]">{key.lastUsedBy}</div>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>

                {/* Sparkline */}
                <Sparkline
                  data={key.accessHistory}
                  color={key.status === "revoked" ? "var(--text-500)" : "var(--accent-brand)"}
                />

                {/* Actions */}
                <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-400)] transition-colors hover:bg-[var(--bg-300)] hover:text-[var(--text-000)]">
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

        {/* Team Access + Rotation side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Team Access */}
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
            <div className="border-b-0.5 px-5 py-3.5" style={{ borderColor: "var(--border-300)" }}>
              <h2 className="text-sm font-semibold text-[var(--text-000)]">Team Access</h2>
            </div>
            {team.map((member, i) => (
              <div
                key={member.email}
                className="flex items-center justify-between px-5 py-2.5"
                style={{ borderBottom: i < team.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div className="text-sm text-[var(--text-000)]">{member.name}</div>
                    <div className="text-[10px] text-[var(--text-500)]">{member.email}</div>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  member.role === "owner" ? "bg-[var(--accent-brand)]/10 text-[var(--accent-brand)]" :
                  member.role === "admin" ? "bg-[hsl(210,66%,67%)]/10 text-[hsl(210,66%,67%)]" :
                  member.role === "developer" ? "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]" :
                  "bg-[var(--bg-300)] text-[var(--text-400)]"
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          {/* Rotation Schedules */}
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
            <div className="border-b-0.5 px-5 py-3.5" style={{ borderColor: "var(--border-300)" }}>
              <h2 className="text-sm font-semibold text-[var(--text-000)]">Key Rotation</h2>
            </div>
            {rotatingKeys.map((key, i) => {
              const daysMatch = key.rotationSchedule?.match(/(\d+)/);
              const days = daysMatch ? parseInt(daysMatch[1]) : 0;
              const created = new Date(key.created);
              const nextRotation = new Date(created);
              nextRotation.setDate(nextRotation.getDate() + days);
              const daysUntil = Math.max(0, Math.ceil((nextRotation.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <div
                  key={key.id}
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ borderBottom: i < rotatingKeys.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--text-000)]">{key.name}</div>
                    <div className="text-[10px] text-[var(--text-500)]">{key.project} · every {key.rotationSchedule}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${daysUntil <= 7 ? "text-[hsl(40,71%,50%)]" : "text-[var(--text-200)]"}`}>
                      {daysUntil}d
                    </span>
                    <button className="rounded-md border-0.5 px-2 py-1 text-[10px] font-medium text-[var(--text-400)] transition-colors hover:bg-[var(--bg-300)] hover:text-[var(--text-000)]" style={{ borderColor: "var(--border-300)" }}>
                      Rotate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-500)]">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent ? "text-[var(--accent-brand)]" : "text-[var(--text-000)]"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-[var(--text-400)]">{sub}</div>
    </div>
  );
}
