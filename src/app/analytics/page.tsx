"use client";

import { Shell } from "@/components/shell";
import { usageData, keys, auditLog } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const totalSpend30d = usageData.reduce((s, d) => s + d.total, 0);
  const totalTokens = keys.reduce((s, k) => s + k.tokensToday.input + k.tokensToday.output + k.tokensToday.cached, 0);
  const avgLatency = "1,240ms";

  // Chart dimensions
  const chartW = 720;
  const chartH = 200;
  const maxVal = Math.max(...usageData.map((d) => d.total));

  // Stacked bar data
  const barWidth = chartW / usageData.length - 2;

  return (
    <Shell>
      <div className="px-8 py-6">
        <div className="mb-6">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
            Usage Analytics
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Cost, usage, and performance across all keys
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">30-Day Spend</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">${totalSpend30d.toFixed(2)}</div>
            <div className="mt-0.5 text-xs text-emerald-400">-12% vs prior period</div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">Tokens Today</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">{(totalTokens / 1_000_000).toFixed(1)}M</div>
            <div className="mt-0.5 text-xs text-[var(--text-muted)]">input + output + cached</div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">Avg Latency (p50)</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">{avgLatency}</div>
            <div className="mt-0.5 text-xs text-[var(--text-muted)]">p95: 3,420ms</div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">Error Rate</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-400">0.3%</div>
            <div className="mt-0.5 text-xs text-[var(--text-muted)]">12 errors / 4,293 req</div>
          </div>
        </div>

        {/* Stacked bar chart */}
        <div className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Daily Spend by Model</h2>
            <div className="flex items-center gap-4">
              <Legend color="#d97757" label="Opus 4.6" />
              <Legend color="#6a9bcc" label="Sonnet 4.5" />
              <Legend color="#788c5d" label="Haiku 4.5" />
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 30}`} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <g key={pct}>
                <line
                  x1="0"
                  y1={chartH * (1 - pct)}
                  x2={chartW}
                  y2={chartH * (1 - pct)}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4,4"
                />
                <text x="-4" y={chartH * (1 - pct) + 4} textAnchor="end" fill="var(--text-subtle)" fontSize="9" fontFamily="var(--font-mono)">
                  ${Math.round(maxVal * pct)}
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
                  {/* Haiku (bottom) */}
                  <rect x={x} y={chartH - haikuH} width={barWidth} height={haikuH} rx="2" fill="#788c5d" opacity="0.9" />
                  {/* Sonnet (middle) */}
                  <rect x={x} y={chartH - haikuH - sonnetH} width={barWidth} height={sonnetH} rx="2" fill="#6a9bcc" opacity="0.9" />
                  {/* Opus (top) */}
                  <rect x={x} y={chartH - haikuH - sonnetH - opusH} width={barWidth} height={opusH} rx="2" fill="#d97757" opacity="0.9" />

                  {/* Date labels (every 5th) */}
                  {i % 5 === 0 && (
                    <text x={x + barWidth / 2} y={chartH + 16} textAnchor="middle" fill="var(--text-subtle)" fontSize="9" fontFamily="var(--font-mono)">
                      {d.date.slice(5)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Model distribution + Token breakdown side by side */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Model distribution */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Model Distribution (Today)</h2>
            <div className="space-y-3">
              <ModelBar label="Opus 4.6" pct={38} cost="$37.24" color="#d97757" />
              <ModelBar label="Sonnet 4.5" pct={42} cost="$28.50" color="#6a9bcc" />
              <ModelBar label="Haiku 4.5" pct={20} cost="$4.33" color="#788c5d" />
            </div>
          </div>

          {/* Token breakdown */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Token Breakdown (Today)</h2>
            <div className="space-y-3">
              <TokenRow label="Input Tokens" value="2.57M" pct={47} color="var(--accent-primary)" />
              <TokenRow label="Output Tokens" value="1.76M" pct={32} color="var(--accent-blue)" />
              <TokenRow label="Cached Tokens" value="1.31M" pct={24} color="var(--accent-green)" sub="saving ~$8.40" />
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {auditLog.map((entry, i) => (
              <div key={i} className="grid grid-cols-[140px_130px_100px_80px_70px_80px_1fr] items-center gap-4 px-5 py-2.5 text-xs">
                <code className="font-[var(--font-mono)] text-[var(--text-muted)]">{entry.timestamp.split(" ")[1]}</code>
                <span className="font-medium text-[var(--text-primary)]">{entry.key}</span>
                <span className="text-[var(--text-muted)]">{entry.model}</span>
                <span className="text-[var(--text-muted)]">{(entry.tokens / 1000).toFixed(1)}K tok</span>
                <span className="font-medium text-[var(--text-primary)]">${entry.cost.toFixed(2)}</span>
                <span className="text-[var(--text-muted)]">{entry.latency}ms</span>
                <span className="text-right text-[var(--text-subtle)]">{entry.user || "—"}</span>
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
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
    </div>
  );
}

function ModelBar({ label, pct, cost, color }: { label: string; pct: number; cost: string; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-[var(--text-primary)]">{label}</span>
        <span className="text-sm font-medium text-[var(--text-primary)]">{cost} <span className="text-[var(--text-subtle)]">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--bg-elevated)]">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function TokenRow({ label, value, pct, color, sub }: { label: string; value: string; pct: number; color: string; sub?: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-[var(--text-primary)]">{label}</span>
        <div className="text-right">
          <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
          {sub && <span className="ml-2 text-xs text-emerald-400">{sub}</span>}
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)]">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
