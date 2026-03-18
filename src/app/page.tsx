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
      <div className="px-8 py-6 max-w-[960px]">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-000)]" style={{ fontFamily: "var(--font-serif)" }}>
              Keys
            </h1>
            <p className="mt-1 text-sm text-[var(--text-400)]">
              Designed for Claude to safely access API keys and request the relevant permissions each time
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
            + Import Key
          </button>
        </div>

        {/* Artifacts-style tabs */}
        <div className="mb-5 flex items-center gap-1 border-b-0.5" style={{ borderColor: "var(--border-300)" }}>
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[var(--text-000)]"
                  : "text-[var(--text-400)] hover:text-[var(--text-200)]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--text-000)]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "keys" && <KeysTab />}
        {activeTab === "activity" && <ActivityTab />}
        {activeTab === "services" && <ServicesTab />}
      </div>
    </Shell>
  );
}

/* ── Tab 1: All Keys — pending requests + project cards ── */
function KeysTab() {
  return (
    <div className="space-y-4">
      {/* Pending access requests from Claude */}
      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[var(--accent-brand)]">Requested by Claude</span>
            <span className="rounded-full bg-[var(--accent-brand)]/15 px-1.5 py-0 text-[10px] font-medium text-[var(--accent-brand)]">{pendingRequests.length}</span>
          </div>
          {pendingRequests.map((req) => {
            const envDef = environments.find((e) => e.name === req.suggestedEnvironment);
            return (
              <div
                key={req.id}
                className="rounded-xl border-0.5 bg-[var(--bg-100)] overflow-hidden"
                style={{ borderColor: "var(--accent-brand)", borderWidth: "1px" }}
              >
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-brand)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        <span className="text-sm font-medium text-[var(--text-000)]">Claude wants to use</span>
                        <code className="text-sm font-medium text-[var(--accent-brand)] bg-[var(--accent-brand)]/10 px-1.5 py-0.5 rounded" style={{ fontFamily: "var(--font-mono)" }}>{req.keyName}</code>
                      </div>
                      <p className="text-xs text-[var(--text-400)] mb-3">{req.reason}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-md bg-[var(--bg-200)] px-2.5 py-1.5">
                          <span className="text-[10px] text-[var(--text-500)]">Project</span>
                          <span className="text-xs font-medium text-[var(--text-000)]">{req.suggestedProject}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-md bg-[var(--bg-200)] px-2.5 py-1.5">
                          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: envDef?.color }} />
                          <span className="text-[10px] text-[var(--text-500)]">Environment</span>
                          <span className="text-xs font-medium text-[var(--text-000)]">{envDef?.label}</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-500)]">{req.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                      <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-xs font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
                        Approve
                      </button>
                      {envDef && envDef.approvalLevel !== "none" && (
                        <button className="rounded-lg border-0.5 px-4 py-2 text-xs font-medium text-[var(--text-300)] transition-colors hover:bg-[var(--bg-200)] hover:text-[var(--text-000)]" style={{ borderColor: "var(--border-300)" }}>
                          Escalate to {envDef.approvalName}
                        </button>
                      )}
                      <button className="rounded-lg px-3 py-2 text-xs text-[var(--text-500)] transition-colors hover:text-[hsl(0,70%,65%)] hover:bg-[hsl(0,70%,65%)]/10">
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project cards */}
      {projects.map((project) => {
        const projectKeys = keys.filter((k) => k.project === project);
        return <ProjectCard key={project} project={project} keys={projectKeys} />;
      })}

      {/* New project card */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border-0.5 border-dashed py-4 text-sm text-[var(--text-500)] transition-colors hover:bg-[var(--bg-100)] hover:text-[var(--text-300)] hover:border-[var(--text-500)]" style={{ borderColor: "var(--border-300)" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
        New project
      </button>
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
    <div className="rounded-xl border-0.5 bg-[var(--bg-100)] overflow-hidden" style={{ borderColor: "var(--border-300)" }}>
      {/* Project header */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--text-000)]">{project}</span>
          <span className="text-xs text-[var(--text-400)]">
            {activeCount} active · {totalAccesses.toLocaleString()} accesses today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md px-2 py-1 text-xs text-[var(--text-500)] transition-colors hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]">
            + Add key
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-500)] transition-colors hover:bg-[var(--bg-300)] hover:text-[var(--text-200)]">
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
              {/* Key row — two-tone bg, description-first */}
              <button
                onClick={() => setExpandedKey(isExpanded ? null : key.id)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-[var(--bg-300)] border-t-0.5 bg-[var(--bg-200)]"
                style={{ borderColor: "var(--border-300)" }}
              >
                {/* Expand chevron */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="var(--text-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>

                {/* Environment dot + label */}
                <div className="flex items-center gap-1.5 w-[100px] flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: envDef.color }} />
                  <span className="text-xs text-[var(--text-300)]">{envDef.label}</span>
                </div>

                {/* Description (replaces key name in collapsed view) */}
                <span className="text-sm text-[var(--text-200)] flex-1 min-w-0 truncate">{key.description}</span>

                {/* Source badge */}
                {key.source.type === "imported" && key.source.provider && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-300)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-400)] flex-shrink-0">
                    from {key.source.provider}
                  </span>
                )}

                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 text-xs flex-shrink-0 ${status.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </button>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="bg-[var(--bg-000)] px-5 py-4 border-t-0.5" style={{ borderColor: "var(--border-300)" }}>
                  {/* Actions bar */}
                  <div className="ml-[24px] flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <code className="text-xs text-[var(--text-300)] bg-[var(--bg-200)] px-2 py-1 rounded" style={{ fontFamily: "var(--font-mono)" }}>{key.name}</code>
                      <span className={`text-[10px] font-medium ${
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
                      <button className="rounded-md border-0.5 px-3 py-1.5 text-[11px] font-medium text-[var(--text-300)] transition-colors hover:bg-[var(--bg-200)] hover:text-[var(--text-000)]" style={{ borderColor: "var(--border-300)" }}>
                        Edit
                      </button>
                      <button className="rounded-md border-0.5 px-3 py-1.5 text-[11px] font-medium text-[var(--accent-brand)] transition-colors hover:bg-[var(--accent-brand)]/10" style={{ borderColor: "var(--border-300)" }}>
                        Rotate
                      </button>
                      <button className="rounded-md border-0.5 px-3 py-1.5 text-[11px] font-medium text-[hsl(0,70%,65%)] transition-colors hover:bg-[hsl(0,70%,65%)]/10" style={{ borderColor: "var(--border-300)" }}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="ml-[24px] grid grid-cols-3 gap-6">
                    {/* Key info */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Key prefix</div>
                        <code className="text-xs text-[var(--text-300)]" style={{ fontFamily: "var(--font-mono)" }}>{key.prefix}</code>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Created</div>
                        <span className="text-xs text-[var(--text-300)]">{key.created}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Last accessed</div>
                        <span className="text-xs text-[var(--text-300)]">{key.lastUsed}</span>
                        <div className="text-[10px] text-[var(--text-500)]">{key.lastUsedBy}</div>
                      </div>
                      {key.source.type === "imported" && key.source.provider && (
                        <div>
                          <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Imported from</div>
                          <span className="text-xs text-[hsl(210,66%,67%)]">{key.source.provider}</span>
                        </div>
                      )}
                    </div>

                    {/* Usage */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Accesses today</div>
                        <span className="text-sm font-medium text-[var(--text-000)]">{key.accessesToday.toLocaleString()}</span>
                        <span className="text-xs text-[var(--text-500)]"> / {key.accessLimit.toLocaleString()}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Models</div>
                        <div className="flex flex-wrap gap-1">
                          {key.models.map((m) => (
                            <span key={m} className="rounded bg-[var(--bg-300)] px-1.5 py-0.5 text-[10px] text-[var(--text-300)]">{m.replace("claude-", "")}</span>
                          ))}
                          {key.models.length === 0 && <span className="text-[10px] text-[var(--text-500)]">None</span>}
                        </div>
                      </div>
                      {key.rotationSchedule && (
                        <div>
                          <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Rotation</div>
                          <span className="text-xs text-[var(--text-300)]">Every {key.rotationSchedule}</span>
                        </div>
                      )}
                    </div>

                    {/* 14-day trend */}
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-2">14-day trend</div>
                      <Sparkline
                        data={key.accessHistory}
                        color={key.status === "revoked" ? "var(--text-500)" : "var(--accent-brand)"}
                      />
                      {key.secretsSync.length > 0 && (
                        <div className="mt-3">
                          <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-1">Secrets sync</div>
                          <div className="flex gap-1.5">
                            {key.secretsSync.map((sync) => (
                              <span
                                key={sync.provider}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
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

/* ── Tab 2: Activity ── */
function ActivityTab() {
  return (
    <div className="space-y-5">
      {/* Agent Activity Timeline */}
      <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
        <div className="border-b-0.5 px-5 py-3.5 flex items-center justify-between" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="text-sm font-semibold text-[var(--text-000)]">Access Log</h2>
          <span className="text-[10px] text-[var(--text-500)]">Key access requests and approvals</span>
        </div>
        <div>
          {agentActivity.map((entry, i) => (
            <div
              key={i}
              className="flex gap-3 px-5 py-2.5"
              style={{ borderBottom: i < agentActivity.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
            >
              <div className="flex flex-col items-center pt-1">
                <div className={`h-2 w-2 rounded-full ${
                  entry.action === "Access approved" || entry.action === "Access auto-approved" ? "bg-[hsl(97,59%,46%)]" :
                  entry.action === "Access requested" ? "bg-[var(--accent-brand)]" :
                  entry.action === "Access escalated" ? "bg-[hsl(40,71%,50%)]" :
                  "bg-[var(--text-500)]"
                }`} />
                {i < agentActivity.length - 1 && <div className="mt-1 w-px flex-1 bg-[var(--border-300)]" />}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-000)]">{entry.action}</span>
                  {entry.service && (
                    <span className="rounded bg-[var(--bg-300)] px-1.5 py-0 text-[10px] text-[var(--text-400)]">
                      {entry.service}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-400)]">{entry.detail}</div>
                <div className="mt-0.5 text-[10px] text-[var(--text-500)]">
                  {entry.timestamp} · {entry.agent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
        <div className="border-b-0.5 px-5 py-3.5" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="text-sm font-semibold text-[var(--text-000)]">Audit Trail</h2>
        </div>
        <div>
          {auditLog.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-2.5 text-xs"
              style={{ borderBottom: i < auditLog.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
            >
              <code className="text-[var(--text-500)] w-[60px] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{entry.timestamp.split(" ")[1]}</code>
              <span className="font-medium text-[var(--text-000)] w-[120px] flex-shrink-0 truncate">{entry.user}</span>
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
    <div className="space-y-5">
      {/* Protocol explanation */}
      <div className="rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-brand)]/15">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-brand)">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-000)]">Connected Services</h2>
            <p className="text-xs text-[var(--text-400)]">
              Services connected to Claude Keys. When Claude needs access to a key, it requests permission from the right person based on the environment&apos;s approval policy.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Services list */}
      <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
        <div className="border-b-0.5 px-5 py-3.5 flex items-center justify-between" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="text-sm font-semibold text-[var(--text-000)]">Connected Services</h2>
          <button className="rounded-md border-0.5 px-3 py-1 text-xs font-medium text-[var(--text-400)] transition-colors hover:bg-[var(--bg-300)] hover:text-[var(--text-000)]" style={{ borderColor: "var(--border-300)" }}>
            + Connect Service
          </button>
        </div>
        {connectedServices.map((service, i) => (
          <div
            key={service.name}
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: i < connectedServices.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium text-[var(--text-000)]">{service.name}</div>
                {service.keysManaged > 0 ? (
                  <div className="text-[11px] text-[var(--text-400)]">
                    {service.keysManaged} key{service.keysManaged !== 1 ? "s" : ""} managed · last accessed {service.lastAccessed}
                  </div>
                ) : (
                  <div className="text-[11px] text-[var(--text-500)]">
                    No keys added yet
                  </div>
                )}
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              service.status === "enabled" ? "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]" :
              service.status === "pending" ? "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]" :
              "bg-[var(--bg-300)] text-[var(--text-500)]"
            }`}>
              {service.status === "enabled" ? "Enrolled" : service.status === "pending" ? "Pending" : "Not connected"}
            </span>
          </div>
        ))}
      </div>

      {/* Secrets sync status */}
      <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
        <div className="border-b-0.5 px-5 py-3.5" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="text-sm font-semibold text-[var(--text-000)]">Secrets Sync</h2>
        </div>
        {keys
          .filter((k) => k.secretsSync.length > 0)
          .map((key, i, arr) => (
            <div
              key={key.id}
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: i < arr.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
            >
              <div>
                <span className="text-sm font-medium text-[var(--text-000)]">{key.name}</span>
                <span className="ml-2 text-xs text-[var(--text-500)]">{key.project}</span>
              </div>
              <div className="flex items-center gap-2">
                {key.secretsSync.map((sync) => (
                  <span
                    key={sync.provider}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
  );
}
