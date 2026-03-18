"use client";

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Sparkline } from "@/components/sparkline";
import { FeaturePromo } from "@/components/feature-promo";
import {
  keys,
  environments,
  connectedServices,
  agentActivity,
  auditLog,
  pendingRequests,
  type ApiKey,
} from "@/lib/mock-data";

const statusColors: Record<string, { dot: string; label: string; text: string }> = {
  active: { dot: "bg-[hsl(97,59%,46%)]", label: "Active", text: "text-[hsl(97,59%,46%)]" },
  expiring: { dot: "bg-[hsl(40,71%,50%)]", label: "Expiring", text: "text-[hsl(40,71%,50%)]" },
  revoked: { dot: "bg-[hsl(0,98%,75%)]", label: "Revoked", text: "text-[hsl(0,98%,75%)]" },
  "rate-limited": { dot: "bg-[hsl(15,63%,60%)]", label: "Rate Limited", text: "text-[hsl(15,63%,60%)]" },
};

type Tab = "keys" | "activity" | "services";

const tabDefs: { id: Tab; label: string }[] = [
  { id: "keys", label: "All keys" },
  { id: "activity", label: "Activity" },
  { id: "services", label: "Services" },
];

// Derive unique projects from keys
const projects = [...new Set(keys.map((k) => k.project))];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("keys");

  return (
    <Shell>
      <FeaturePromo />
      <div className="px-10 py-8 max-w-[920px]">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-medium tracking-[-0.02em] text-[var(--text-000)] mb-1.5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Keys
          </h1>
          <p className="text-[13px] text-[var(--text-400)] leading-relaxed max-w-[520px]">
            Designed for Claude to safely access your team&apos;s API keys and request the relevant permissions each time.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center gap-0.5">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-[var(--bg-200)] text-[var(--text-000)]"
                  : "text-[var(--text-400)] hover:text-[var(--text-200)] hover:bg-[var(--bg-200)]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-[13px] font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]">
            Import Key
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "keys" && <KeysTab />}
        {activeTab === "activity" && <ActivityTab />}
        {activeTab === "services" && <ServicesTab />}
      </div>
    </Shell>
  );
}

/* ── Tab 1: All Keys ── */
function KeysTab() {
  return (
    <div className="space-y-6">
      {/* Pending access requests */}
      {pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-brand)]"
            >
              Requested by Claude
            </span>
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent-brand)] text-[10px] font-semibold text-white">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const envDef = environments.find((e) => e.name === req.suggestedEnvironment);
              const needsEscalation = envDef && envDef.approvalLevel !== "none";

              return (
                <div
                  key={req.id}
                  className="group rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, rgba(216,119,86,0.08) 0%, rgba(216,119,86,0.03) 100%)",
                    border: "1px solid rgba(216,119,86,0.25)",
                  }}
                >
                  <div className="p-6">
                    {/* Top: sparkle + request text */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-brand)]/15">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-brand)">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-[13px] text-[var(--text-300)]">Claude wants to use</span>
                          <span
                            className="text-[13px] font-semibold text-[var(--text-000)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {req.keyName}
                          </span>
                        </div>
                        <p className="text-[12px] text-[var(--text-400)] mt-1 leading-relaxed">{req.reason}</p>
                      </div>
                    </div>

                    {/* Metadata pills */}
                    <div className="flex items-center gap-2 mb-5 ml-10">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--bg-200)] px-2.5 py-1.5 text-[11px]">
                        <span className="text-[var(--text-500)]">Project</span>
                        <span className="font-medium text-[var(--text-100)]">{req.suggestedProject}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--bg-200)] px-2.5 py-1.5 text-[11px]">
                        <span className="h-[6px] w-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: envDef?.color }} />
                        <span className="font-medium text-[var(--text-100)]">{envDef?.label}</span>
                      </span>
                      <span className="text-[11px] text-[var(--text-500)]">{req.timestamp}</span>
                    </div>

                    {/* Actions — clean split */}
                    <div className="flex gap-2.5 ml-10">
                      {needsEscalation ? (
                        <>
                          <button className="flex-1 rounded-xl bg-[var(--accent-brand)] py-3 text-[13px] font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]">
                            Escalate to {envDef.approvalName}
                          </button>
                          <button className="flex-1 rounded-xl py-3 text-[13px] font-medium text-[var(--text-400)] transition-all duration-150 hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]" style={{ border: "1px solid var(--border-300)" }}>
                            Deny
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex-1 rounded-xl bg-[var(--accent-brand)] py-3 text-[13px] font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]">
                            Approve
                          </button>
                          <button className="flex-1 rounded-xl py-3 text-[13px] font-medium text-[var(--text-400)] transition-all duration-150 hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]" style={{ border: "1px solid var(--border-300)" }}>
                            Deny
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const projectKeys = keys.filter((k) => k.project === project);
          return <ProjectCard key={project} project={project} keys={projectKeys} />;
        })}

        {/* New project */}
        <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed py-5 text-[13px] text-[var(--text-500)] transition-all duration-150 hover:bg-[var(--bg-100)] hover:text-[var(--text-300)] hover:border-[var(--text-500)]" style={{ borderColor: "var(--border-300)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
          New project
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ project, keys: projectKeys }: { project: string; keys: ApiKey[] }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const activeCount = projectKeys.filter((k) => k.status === "active").length;
  const totalAccesses = projectKeys.reduce((s, k) => s + k.accessesToday, 0);

  // Group keys by environment
  const envOrder = ["production", "staging", "development"] as const;
  const envGroups = envOrder
    .map((envName) => ({
      envDef: environments.find((e) => e.name === envName)!,
      keys: projectKeys.filter((k) => k.environment === envName),
    }))
    .filter((g) => g.keys.length > 0);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-300)" }}>
      {/* Project header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-100)]">
        <div className="flex items-center gap-4">
          <h3
            className="text-[15px] font-semibold text-[var(--text-000)] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {project}
          </h3>
          <span className="text-[12px] text-[var(--text-500)]">
            {activeCount} active &middot; {totalAccesses.toLocaleString()} accesses
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="rounded-lg px-3 py-1.5 text-[12px] text-[var(--text-400)] transition-all duration-150 hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]">
            + Add key
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-500)] transition-all duration-150 hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="8" cy="13" r="1.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Key rows */}
      {envGroups.map(({ envDef, keys: envKeys }) =>
        envKeys.map((key) => {
          const status = statusColors[key.status];
          const isExpanded = expandedKey === key.id;

          return (
            <div key={key.id}>
              <button
                onClick={() => setExpandedKey(isExpanded ? null : key.id)}
                className="flex w-full items-center gap-4 px-6 py-3.5 text-left transition-all duration-100 hover:bg-[var(--bg-200)] bg-[var(--bg-100)]/60"
                style={{ borderTop: "1px solid var(--border-300)" }}
              >
                {/* Chevron */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="var(--text-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>

                {/* Environment */}
                <div className="flex items-center gap-2 w-[110px] flex-shrink-0">
                  <span className="h-[7px] w-[7px] rounded-full flex-shrink-0" style={{ backgroundColor: envDef.color }} />
                  <span className="text-[12px] text-[var(--text-300)]">{envDef.label}</span>
                </div>

                {/* Description */}
                <span className="text-[13px] text-[var(--text-200)] flex-1 min-w-0 truncate">{key.description}</span>

                {/* Source badge */}
                {key.source.type === "imported" && key.source.provider && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-300)] px-2 py-0.5 text-[11px] text-[var(--text-400)] flex-shrink-0">
                    from {key.source.provider}
                  </span>
                )}

                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 text-[12px] flex-shrink-0 ${status.text}`}>
                  <span className={`h-[6px] w-[6px] rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="bg-[var(--bg-000)] px-6 py-5" style={{ borderTop: "1px solid var(--border-300)" }}>
                  {/* Actions bar */}
                  <div className="ml-[26px] flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <code className="text-[12px] text-[var(--text-300)] bg-[var(--bg-200)] px-2.5 py-1 rounded-md" style={{ fontFamily: "var(--font-mono)" }}>{key.name}</code>
                      <span className={`text-[11px] font-medium ${
                        envDef.approvalLevel === "cto"
                          ? "text-[hsl(0,70%,65%)]"
                          : envDef.approvalLevel === "team-lead" || envDef.approvalLevel === "vp-eng"
                          ? "text-[hsl(40,71%,50%)]"
                          : "text-[hsl(97,59%,46%)]"
                      }`}>
                        {envDef.approvalLevel === "none" ? "Auto-approved" : `Requires ${envDef.approvalName}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[var(--text-300)] transition-all duration-150 hover:bg-[var(--bg-200)] hover:text-[var(--text-000)]" style={{ border: "1px solid var(--border-300)" }}>
                        Edit
                      </button>
                      <button className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[var(--accent-brand)] transition-all duration-150 hover:bg-[var(--accent-brand)]/10" style={{ border: "1px solid var(--border-300)" }}>
                        Rotate
                      </button>
                      <button className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[hsl(0,70%,65%)] transition-all duration-150 hover:bg-[hsl(0,70%,65%)]/10" style={{ border: "1px solid var(--border-300)" }}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="ml-[26px] grid grid-cols-3 gap-8">
                    {/* Key info */}
                    <div className="space-y-4">
                      <DetailField label="Key prefix" value={<code style={{ fontFamily: "var(--font-mono)" }}>{key.prefix}</code>} />
                      <DetailField label="Created" value={key.created} />
                      <DetailField label="Last accessed" value={key.lastUsed} subtext={key.lastUsedBy} />
                      {key.source.type === "imported" && key.source.provider && (
                        <DetailField label="Imported from" value={<span className="text-[hsl(210,66%,67%)]">{key.source.provider}</span>} />
                      )}
                    </div>

                    {/* Usage */}
                    <div className="space-y-4">
                      <DetailField
                        label="Accesses today"
                        value={
                          <span>
                            <span className="text-[14px] font-semibold text-[var(--text-000)]">{key.accessesToday.toLocaleString()}</span>
                            <span className="text-[12px] text-[var(--text-500)]"> / {key.accessLimit.toLocaleString()}</span>
                          </span>
                        }
                      />
                      <DetailField
                        label="Models"
                        value={
                          <div className="flex flex-wrap gap-1.5">
                            {key.models.map((m) => (
                              <span key={m} className="rounded-md bg-[var(--bg-300)] px-2 py-0.5 text-[11px] text-[var(--text-300)]">{m.replace("claude-", "")}</span>
                            ))}
                            {key.models.length === 0 && <span className="text-[11px] text-[var(--text-500)]">None</span>}
                          </div>
                        }
                      />
                      {key.rotationSchedule && (
                        <DetailField label="Rotation" value={`Every ${key.rotationSchedule}`} />
                      )}
                    </div>

                    {/* Trend */}
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-500)] mb-3">14-day trend</div>
                      <Sparkline
                        data={key.accessHistory}
                        color={key.status === "revoked" ? "var(--text-500)" : "var(--accent-brand)"}
                      />
                      {key.secretsSync.length > 0 && (
                        <div className="mt-4">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-500)] mb-2">Secrets sync</div>
                          <div className="flex gap-2">
                            {key.secretsSync.map((sync) => (
                              <span
                                key={sync.provider}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                                  sync.status === "synced"
                                    ? "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]"
                                    : "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]"
                                }`}
                              >
                                <span className={`h-1 w-1 rounded-full ${sync.status === "synced" ? "bg-[hsl(97,59%,46%)]" : "bg-[hsl(40,71%,50%)]"}`} />
                                {sync.provider}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function DetailField({ label, value, subtext }: { label: string; value: React.ReactNode; subtext?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-500)] mb-1">{label}</div>
      <div className="text-[13px] text-[var(--text-200)]">{value}</div>
      {subtext && <div className="text-[11px] text-[var(--text-500)] mt-0.5">{subtext}</div>}
    </div>
  );
}

/* ── Tab 2: Activity ── */
function ActivityTab() {
  return (
    <div className="space-y-6">
      {/* Access Log */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-300)" }}>
        <div className="px-6 py-4 flex items-center justify-between bg-[var(--bg-100)]" style={{ borderBottom: "1px solid var(--border-300)" }}>
          <h2
            className="text-[15px] font-semibold text-[var(--text-000)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Access Log
          </h2>
          <span className="text-[11px] text-[var(--text-500)]">Key access requests and approvals</span>
        </div>
        <div className="bg-[var(--bg-100)]/60">
          {agentActivity.map((entry, i) => (
            <div
              key={i}
              className="flex gap-4 px-6 py-3.5"
              style={{ borderBottom: i < agentActivity.length - 1 ? "1px solid var(--border-300)" : "none" }}
            >
              <div className="flex flex-col items-center pt-1.5">
                <div className={`h-[8px] w-[8px] rounded-full ${
                  entry.action === "Access approved" || entry.action === "Access auto-approved" ? "bg-[hsl(97,59%,46%)]" :
                  entry.action === "Access requested" ? "bg-[var(--accent-brand)]" :
                  entry.action === "Access escalated" ? "bg-[hsl(40,71%,50%)]" :
                  "bg-[var(--text-500)]"
                }`} />
                {i < agentActivity.length - 1 && <div className="mt-1.5 w-px flex-1 bg-[var(--border-300)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-medium text-[var(--text-000)]">{entry.action}</span>
                  {entry.service && (
                    <span className="rounded-md bg-[var(--bg-300)] px-2 py-0.5 text-[11px] text-[var(--text-400)]">
                      {entry.service}
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-[var(--text-400)] mt-0.5">{entry.detail}</div>
                <div className="text-[11px] text-[var(--text-500)] mt-1">
                  {entry.timestamp} &middot; {entry.agent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-300)" }}>
        <div className="px-6 py-4 bg-[var(--bg-100)]" style={{ borderBottom: "1px solid var(--border-300)" }}>
          <h2
            className="text-[15px] font-semibold text-[var(--text-000)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Audit Trail
          </h2>
        </div>
        <div className="bg-[var(--bg-100)]/60">
          {auditLog.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-5 px-6 py-3.5 text-[12px]"
              style={{ borderBottom: i < auditLog.length - 1 ? "1px solid var(--border-300)" : "none" }}
            >
              <code className="text-[var(--text-500)] w-[56px] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{entry.timestamp.split(" ")[1]}</code>
              <span className="font-medium text-[var(--text-100)] w-[120px] flex-shrink-0 truncate">{entry.user}</span>
              <span className="text-[var(--text-300)] w-[100px] flex-shrink-0 truncate">{entry.project}</span>
              <span className="text-[var(--text-400)] flex-shrink-0">{entry.model}</span>
              <span className="text-[var(--text-400)] flex-shrink-0">{(entry.tokens / 1000).toFixed(1)}K tok</span>
              <span className="text-[var(--text-500)] ml-auto truncate">{entry.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab 3: Services ── */
function ServicesTab() {
  return (
    <div className="space-y-6">
      {/* Explainer */}
      <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(216,119,86,0.06) 0%, rgba(216,119,86,0.02) 100%)", border: "1px solid rgba(216,119,86,0.15)" }}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-brand)]/15">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-brand)">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <h2
              className="text-[15px] font-semibold text-[var(--text-000)] mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Connected Services
            </h2>
            <p className="text-[13px] text-[var(--text-300)] leading-relaxed">
              Services connected to Claude Keys. When Claude needs access to a key, it requests permission from the right person based on the environment&apos;s approval policy.
            </p>
          </div>
        </div>
      </div>

      {/* Service list */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-300)" }}>
        <div className="px-6 py-4 flex items-center justify-between bg-[var(--bg-100)]" style={{ borderBottom: "1px solid var(--border-300)" }}>
          <h2
            className="text-[15px] font-semibold text-[var(--text-000)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Services
          </h2>
          <button className="rounded-lg px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-400)] transition-all duration-150 hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]" style={{ border: "1px solid var(--border-300)" }}>
            + Connect
          </button>
        </div>
        <div className="bg-[var(--bg-100)]/60">
          {connectedServices.map((service, i) => (
            <div
              key={service.name}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: i < connectedServices.length - 1 ? "1px solid var(--border-300)" : "none" }}
            >
              <div>
                <div className="text-[14px] font-medium text-[var(--text-000)]">{service.name}</div>
                {service.keysManaged > 0 ? (
                  <div className="text-[12px] text-[var(--text-400)] mt-0.5">
                    {service.keysManaged} key{service.keysManaged !== 1 ? "s" : ""} managed &middot; last accessed {service.lastAccessed}
                  </div>
                ) : (
                  <div className="text-[12px] text-[var(--text-500)] mt-0.5">No keys added yet</div>
                )}
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                service.status === "enabled" ? "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]" :
                service.status === "pending" ? "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]" :
                "bg-[var(--bg-300)] text-[var(--text-500)]"
              }`}>
                {service.status === "enabled" ? "Enrolled" : service.status === "pending" ? "Pending" : "Not connected"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Secrets sync */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-300)" }}>
        <div className="px-6 py-4 bg-[var(--bg-100)]" style={{ borderBottom: "1px solid var(--border-300)" }}>
          <h2
            className="text-[15px] font-semibold text-[var(--text-000)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Secrets Sync
          </h2>
        </div>
        <div className="bg-[var(--bg-100)]/60">
          {keys
            .filter((k) => k.secretsSync.length > 0)
            .map((key, i, arr) => (
              <div
                key={key.id}
                className="flex items-center justify-between px-6 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-300)" : "none" }}
              >
                <div>
                  <span className="text-[13px] font-medium text-[var(--text-000)]">{key.name}</span>
                  <span className="ml-2.5 text-[12px] text-[var(--text-500)]">{key.project}</span>
                </div>
                <div className="flex items-center gap-2">
                  {key.secretsSync.map((sync) => (
                    <span
                      key={sync.provider}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium ${
                        sync.status === "synced"
                          ? "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]"
                          : sync.status === "pending"
                          ? "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]"
                          : "bg-[hsl(0,98%,75%)]/10 text-[hsl(0,98%,75%)]"
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${
                        sync.status === "synced" ? "bg-[hsl(97,59%,46%)]" :
                        sync.status === "pending" ? "bg-[hsl(40,71%,50%)]" :
                        "bg-[hsl(0,98%,75%)]"
                      }`} />
                      {sync.provider}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
