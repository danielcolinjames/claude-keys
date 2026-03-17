"use client";

import { Shell } from "@/components/shell";
import { keys } from "@/lib/mock-data";

const secretProviders = [
  {
    name: "1Password",
    icon: "1P",
    status: "connected" as const,
    keysLinked: 4,
    lastSync: "2 min ago",
    vault: "Engineering",
  },
  {
    name: "AWS Secrets Manager",
    icon: "AWS",
    status: "connected" as const,
    keysLinked: 2,
    lastSync: "15 min ago",
    vault: "production/claude",
  },
  {
    name: "Doppler",
    icon: "D",
    status: "connected" as const,
    keysLinked: 1,
    lastSync: "1 hr ago",
    vault: "leftway-prod",
  },
  {
    name: "HashiCorp Vault",
    icon: "HV",
    status: "disconnected" as const,
    keysLinked: 0,
    lastSync: null,
    vault: null,
  },
  {
    name: ".env File Sync",
    icon: "{}",
    status: "disconnected" as const,
    keysLinked: 0,
    lastSync: null,
    vault: null,
  },
];

const rotationHistory = [
  { key: "production-api", date: "2026-03-14", from: "sk-ant...v2Lm", to: "sk-ant...xK3p", synced: ["1Password", "AWS Secrets Manager"], auto: true },
  { key: "being-agent", date: "2026-03-12", from: "sk-ant...hR9m", to: "sk-ant...qW4n", synced: ["1Password"], auto: true },
  { key: "leftway-prod", date: "2026-03-08", from: "sk-ant...pT6y", to: "sk-ant...xK8j", synced: ["1Password", "Doppler"], auto: true },
  { key: "claude-code-dev", date: "2026-03-01", from: "sk-ant...bN7r", to: "sk-ant...nF3k", synced: ["1Password"], auto: false },
];

export default function RotationPage() {
  const rotatingKeys = keys.filter((k) => k.rotationSchedule && k.status !== "revoked");

  return (
    <Shell>
      <div className="px-8 py-6">
        <div className="mb-6">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
            Rotation & Secrets
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Auto-rotate keys and sync to your secrets manager
          </p>
        </div>

        {/* How it works banner */}
        <div className="mb-6 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)]/20">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round">
                <path d="M1.5 2.5v4h4M14.5 13.5v-4h-4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--accent-primary)]">Zero-downtime rotation via proxy</div>
              <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                When a key rotates, Claude Keys generates the new key, syncs it to all connected vaults,
                and updates the proxy — your apps never see a stale key. Use <code className="rounded bg-[var(--bg-elevated)] px-1 font-[var(--font-mono)] text-[10px]">https://proxy.claudekeys.com/v1</code> as your API base URL.
              </div>
            </div>
          </div>
        </div>

        {/* Rotation schedules */}
        <div className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Rotation Schedules</h2>
          </div>

          {rotatingKeys.map((key) => {
            const daysMatch = key.rotationSchedule?.match(/(\d+)/);
            const days = daysMatch ? parseInt(daysMatch[1]) : 0;
            const created = new Date(key.created);
            const nextRotation = new Date(created);
            nextRotation.setDate(nextRotation.getDate() + days);
            const daysUntil = Math.max(0, Math.ceil((nextRotation.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

            return (
              <div key={key.id} className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3.5 last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1.5 2.5v4h4M14.5 13.5v-4h-4" />
                      <path d="M13.66 5.84A5.5 5.5 0 0 0 3.04 3.96L1.5 6.5M2.34 10.16a5.5 5.5 0 0 0 10.62 1.88l1.54-2.54" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{key.name}</div>
                    <code className="text-xs text-[var(--text-muted)] font-[var(--font-mono)]">{key.prefix}</code>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-subtle)]">Schedule</div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">Every {key.rotationSchedule}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--text-subtle)]">Next rotation</div>
                    <div className={`text-sm font-medium ${daysUntil <= 7 ? "text-amber-400" : "text-[var(--text-primary)]"}`}>
                      {daysUntil} days
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {key.secretsSync.map((s) => (
                      <span
                        key={s.provider}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          s.status === "synced"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : s.status === "pending"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {s.provider}
                      </span>
                    ))}
                  </div>
                  <button className="rounded-lg border border-[var(--border-medium)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]">
                    Rotate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secrets providers */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Connected Secrets Managers</h2>
          <div className="grid grid-cols-3 gap-3">
            {secretProviders.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border bg-[var(--bg-surface)] px-4 py-3.5 transition-colors ${
                  p.status === "connected" ? "border-[var(--border-subtle)]" : "border-dashed border-[var(--border-subtle)] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      p.status === "connected" ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "bg-[var(--bg-elevated)] text-[var(--text-subtle)]"
                    }`}>
                      {p.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{p.name}</div>
                      {p.status === "connected" ? (
                        <div className="text-xs text-[var(--text-muted)]">
                          {p.keysLinked} keys &middot; synced {p.lastSync}
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--text-subtle)]">Not connected</div>
                      )}
                    </div>
                  </div>
                  {p.status === "connected" ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l3.5 3.5L13 4.5" />
                      </svg>
                    </span>
                  ) : (
                    <button className="text-xs text-[var(--accent-primary)] hover:underline">Connect</button>
                  )}
                </div>
                {p.vault && (
                  <div className="mt-2 rounded bg-[var(--bg-elevated)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--text-muted)]">
                    vault: {p.vault}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rotation history */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Rotation History</h2>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {rotationHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-4">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${entry.auto ? "bg-[var(--accent-primary)]/10" : "bg-[var(--bg-elevated)]"}`}>
                    {entry.auto ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1.5 2.5v4h4" />
                        <path d="M13.66 5.84A5.5 5.5 0 0 0 3.04 3.96L1.5 6.5" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="8" cy="8" r="3" />
                        <path d="M8 2v2M8 12v2M2 8h2M12 8h2" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{entry.key}</div>
                    <div className="flex items-center gap-1.5 font-[var(--font-mono)] text-[10px] text-[var(--text-muted)]">
                      <span>{entry.from}</span>
                      <span className="text-[var(--text-subtle)]">&rarr;</span>
                      <span>{entry.to}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {entry.synced.map((s) => (
                      <span key={s} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">{s}</span>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{entry.date}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${entry.auto ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}>
                    {entry.auto ? "auto" : "manual"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
