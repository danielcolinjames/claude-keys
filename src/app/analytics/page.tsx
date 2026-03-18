"use client";

import { Shell } from "@/components/shell";
import { usageData, keys, auditLog, team } from "@/lib/mock-data";

export default function ActivityPage() {
  const totalAccesses30d = usageData.reduce((s, d) => s + d.total, 0);
  const totalTokens = keys.reduce((s, k) => s + k.tokensToday.input + k.tokensToday.output + k.tokensToday.cached, 0);
  const avgLatency = "1,240ms";
  const uniqueUsers = new Set(auditLog.map((e) => e.user)).size;

  const chartW = 720;
  const chartH = 200;
  const maxVal = Math.max(...usageData.map((d) => d.total));
  const barWidth = chartW / usageData.length - 2;

  // Per-user access counts
  const userAccesses = auditLog.reduce((acc, entry) => {
    acc[entry.user] = (acc[entry.user] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Shell>
      <div className="px-8 py-6 max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-000)]" style={{ fontFamily: "var(--font-serif)" }}>
            Activity
          </h1>
          <p className="mt-1 text-sm text-[var(--text-400)]">
            Claude access patterns, team usage, and audit trail
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-500)]">30-Day Accesses</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-000)]">{totalAccesses30d.toLocaleString()}</div>
            <div className="mt-0.5 text-xs text-[hsl(97,59%,46%)]">-12% vs prior period</div>
          </div>
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-500)]">Tokens Today</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-000)]">{(totalTokens / 1_000_000).toFixed(1)}M</div>
            <div className="mt-0.5 text-xs text-[var(--text-400)]">input + output + cached</div>
          </div>
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-500)]">Active Users</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-000)]">{uniqueUsers}</div>
            <div className="mt-0.5 text-xs text-[var(--text-400)]">accessed Claude today</div>
          </div>
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-500)]">Avg Latency (p50)</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-000)]">{avgLatency}</div>
            <div className="mt-0.5 text-xs text-[var(--text-400)]">p95: 3,420ms</div>
          </div>
        </div>

        {/* Access chart */}
        <div className="mb-6 rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-000)]">Daily Claude Accesses by Model</h2>
            <div className="flex items-center gap-4">
              <Legend color="var(--accent-brand)" label="Opus 4.6" />
              <Legend color="var(--accent-000)" label="Sonnet 4.5" />
              <Legend color="hsl(97,59%,46%)" label="Haiku 4.5" />
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 30}`} className="overflow-visible">
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <g key={pct}>
                <line
                  x1="0" y1={chartH * (1 - pct)} x2={chartW} y2={chartH * (1 - pct)}
                  stroke="var(--border-300)" strokeDasharray="4,4" strokeOpacity="0.5"
                />
                <text x="-4" y={chartH * (1 - pct) + 4} textAnchor="end" fill="var(--text-500)" fontSize="9" fontFamily="var(--font-mono)">
                  {Math.round(maxVal * pct).toLocaleString()}
                </text>
              </g>
            ))}

            {usageData.map((d, i) => {
              const x = i * (chartW / usageData.length) + 1;
              const haikuH = (d.haiku / maxVal) * chartH;
              const sonnetH = (d.sonnet / maxVal) * chartH;
              const opusH = (d.opus / maxVal) * chartH;

              return (
                <g key={d.date}>
                  <rect x={x} y={chartH - haikuH} width={barWidth} height={haikuH} rx="2" fill="hsl(97,59%,46%)" opacity="0.85" />
                  <rect x={x} y={chartH - haikuH - sonnetH} width={barWidth} height={sonnetH} rx="2" fill="var(--accent-000)" opacity="0.85" />
                  <rect x={x} y={chartH - haikuH - sonnetH - opusH} width={barWidth} height={opusH} rx="2" fill="var(--accent-brand)" opacity="0.85" />

                  {i % 5 === 0 && (
                    <text x={x + barWidth / 2} y={chartH + 16} textAnchor="middle" fill="var(--text-500)" fontSize="9" fontFamily="var(--font-mono)">
                      {d.date.slice(5)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Team usage + Model breakdown side by side */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {/* Team usage */}
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-000)]">Team Usage (Today)</h2>
            <div className="space-y-3">
              {team.map((member) => {
                const count = userAccesses[member.name] || 0;
                const pct = Math.max(5, (count / Math.max(...Object.values(userAccesses), 1)) * 100);
                return (
                  <div key={member.email}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-medium text-white"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar}
                        </div>
                        <span className="text-sm text-[var(--text-000)]">{member.name}</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text-000)]">{count} accesses</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--bg-300)]">
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: member.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model distribution */}
          <div className="rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-000)]">Model Distribution (Today)</h2>
            <div className="space-y-3">
              <ModelBar label="Opus 4.6" pct={22} count="934" color="var(--accent-brand)" />
              <ModelBar label="Sonnet 4.5" pct={52} count="2,238" color="var(--accent-000)" />
              <ModelBar label="Haiku 4.5" pct={26} count="1,121" color="hsl(97,59%,46%)" />
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
          <div className="border-b-0.5 px-5 py-3.5" style={{ borderColor: "var(--border-300)" }}>
            <h2 className="text-sm font-semibold text-[var(--text-000)]">Audit Trail</h2>
          </div>
          <div>
            {auditLog.map((entry, i) => (
              <div
                key={i}
                className="grid grid-cols-[80px_120px_120px_90px_80px_70px_1fr] items-center gap-4 px-5 py-2.5 text-xs"
                style={{ borderBottom: i < auditLog.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
              >
                <code className="text-[var(--text-400)]" style={{ fontFamily: "var(--font-mono)" }}>{entry.timestamp.split(" ")[1]}</code>
                <span className="font-medium text-[var(--text-000)]">{entry.user}</span>
                <span className="text-[var(--text-300)]">{entry.project}</span>
                <span className="text-[var(--text-400)]">{entry.model}</span>
                <span className="text-[var(--text-400)]">{(entry.tokens / 1000).toFixed(1)}K tok</span>
                <span className="text-[var(--text-400)]">{entry.latency}ms</span>
                <span className="text-right text-[var(--text-500)]">{entry.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-xs text-[var(--text-400)]">{label}</span>
    </div>
  );
}

function ModelBar({ label, pct, count, color }: { label: string; pct: number; count: string; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-[var(--text-000)]">{label}</span>
        <span className="text-sm font-medium text-[var(--text-000)]">{count} <span className="text-[var(--text-500)]">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--bg-300)]">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
