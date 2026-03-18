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
} from "@/lib/mock-data";

const statusColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: "bg-[hsl(97,59%,46%)]/10", text: "text-[hsl(97,59%,46%)]", dot: "bg-[hsl(97,59%,46%)]", label: "Active" },
  expiring: { bg: "bg-[hsl(40,71%,50%)]/10", text: "text-[hsl(40,71%,50%)]", dot: "bg-[hsl(40,71%,50%)]", label: "Expiring" },
  revoked: { bg: "bg-[hsl(0,98%,75%)]/10", text: "text-[hsl(0,98%,75%)]", dot: "bg-[hsl(0,98%,75%)]", label: "Revoked" },
  "rate-limited": { bg: "bg-[hsl(15,63%,60%)]/10", text: "text-[hsl(15,63%,60%)]", dot: "bg-[hsl(15,63%,60%)]", label: "Rate Limited" },
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
      <div className="px-8 py-6 max-w-[1200px]">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-000)]" style={{ fontFamily: "var(--font-serif)" }}>
              API Keys
            </h1>
            <p className="mt-1 text-sm text-[var(--text-400)]">
              Manage, monitor, and secure your team&apos;s Claude API keys
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
            + Create Key
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

/* ── Tab 1: All Keys — grouped by project, then environment ── */
function KeysTab() {
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [envFilter, setEnvFilter] = useState<string | null>(null);

  const filteredKeys = keys.filter((k) => {
    if (projectFilter && k.project !== projectFilter) return false;
    if (envFilter && k.environment !== envFilter) return false;
    return true;
  });

  // Group filtered keys by project
  const projectGroups = projects
    .filter((p) => !projectFilter || p === projectFilter)
    .map((project) => ({
      project,
      keys: filteredKeys.filter((k) => k.project === project),
    }))
    .filter((g) => g.keys.length > 0);

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex items-center gap-2">
        {/* Project filter */}
        <div className="relative">
          <select
            value={projectFilter || ""}
            onChange={(e) => setProjectFilter(e.target.value || null)}
            className="appearance-none rounded-lg border-0.5 bg-[var(--bg-100)] pl-3 pr-7 py-1.5 text-xs font-medium text-[var(--text-200)] outline-none transition-colors hover:bg-[var(--bg-200)] cursor-pointer"
            style={{ borderColor: "var(--border-300)" }}
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-400)]" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {/* Environment filter */}
        <div className="relative">
          <select
            value={envFilter || ""}
            onChange={(e) => setEnvFilter(e.target.value || null)}
            className="appearance-none rounded-lg border-0.5 bg-[var(--bg-100)] pl-3 pr-7 py-1.5 text-xs font-medium text-[var(--text-200)] outline-none transition-colors hover:bg-[var(--bg-200)] cursor-pointer"
            style={{ borderColor: "var(--border-300)" }}
          >
            <option value="">All environments</option>
            {environments.map((e) => (
              <option key={e.name} value={e.name}>{e.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-400)]" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {(projectFilter || envFilter) && (
          <button
            onClick={() => { setProjectFilter(null); setEnvFilter(null); }}
            className="rounded-md px-2 py-1 text-[10px] text-[var(--text-400)] hover:text-[var(--text-200)] transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-[11px] text-[var(--text-500)]">
          {filteredKeys.length} key{filteredKeys.length !== 1 ? "s" : ""} across {projectGroups.length} project{projectGroups.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Project groups */}
      {projectGroups.map(({ project, keys: projectKeys }) => (
        <ProjectGroup key={project} project={project} keys={projectKeys} envFilter={envFilter} />
      ))}
    </div>
  );
}

function ProjectGroup({ project, keys: projectKeys, envFilter }: { project: string; keys: typeof keys; envFilter: string | null }) {
  // Group keys by environment
  const envOrder = ["production", "staging", "development"] as const;
  const envGroups = envOrder
    .filter((env) => !envFilter || env === envFilter)
    .map((envName) => {
      const envDef = environments.find((e) => e.name === envName)!;
      const envKeys = projectKeys.filter((k) => k.environment === envName);
      return { envDef, keys: envKeys };
    })
    .filter((g) => g.keys.length > 0);

  const totalAccesses = projectKeys.reduce((s, k) => s + k.accessesToday, 0);
  const activeCount = projectKeys.filter((k) => k.status === "active").length;

  return (
    <div className="rounded-xl border-0.5 bg-[var(--bg-100)] overflow-hidden" style={{ borderColor: "var(--border-300)" }}>
      {/* Project header */}
      <div className="flex items-center justify-between px-5 py-3 border-b-0.5" style={{ borderColor: "var(--border-300)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--bg-300)] text-[11px] font-semibold text-[var(--text-200)]">
            {project.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--text-000)]">{project}</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-[var(--text-500)]">{activeCount} active key{activeCount !== 1 ? "s" : ""}</span>
              <span className="text-[10px] text-[var(--text-500)]">{totalAccesses.toLocaleString()} accesses today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment sections */}
      {envGroups.map(({ envDef, keys: envKeys }, envIdx) => (
        <div key={envDef.name}>
          {/* Environment sub-header with approval badge */}
          <div
            className="flex items-center gap-2 px-5 py-2 bg-[var(--bg-000)]/50"
            style={{ borderBottom: "0.5px solid var(--border-300)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: envDef.color }} />
            <span className="text-[11px] font-medium text-[var(--text-200)]">{envDef.label}</span>
            <span className="text-[10px] text-[var(--text-500)]">·</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
              envDef.approvalLevel === "cto"
                ? "text-[hsl(0,70%,65%)]"
                : envDef.approvalLevel === "team-lead" || envDef.approvalLevel === "vp-eng"
                ? "text-[hsl(40,71%,50%)]"
                : "text-[hsl(97,59%,46%)]"
            }`}>
              {envDef.approvalLevel === "none" ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm2.93 4.72a.75.75 0 00-1.06 0L7 8.59 6.13 7.72a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3.3-3.3a.75.75 0 000-1.06z"/></svg>
                  Auto-approved
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a3 3 0 013 3v2h.5a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 12.5v-5A1.5 1.5 0 014.5 6H5V4a3 3 0 013-3zm0 1.5A1.5 1.5 0 006.5 4v2h3V4A1.5 1.5 0 008 2.5z"/></svg>
                  Requires {envDef.approvalName}
                </>
              )}
            </span>
          </div>

          {/* Key rows */}
          {envKeys.map((key, keyIdx) => {
            const status = statusColors[key.status];
            const accessPct = key.accessLimit > 0 ? (key.accessesToday / key.accessLimit) * 100 : 0;
            const isLast = envIdx === envGroups.length - 1 && keyIdx === envKeys.length - 1;

            return (
              <div
                key={key.id}
                className="grid grid-cols-[1.5fr_1fr_1fr_100px_80px_40px] items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--bg-200)]"
                style={{ borderBottom: isLast ? "none" : "0.5px solid var(--border-300)" }}
              >
                {/* Name + source */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                    key.source.type === "created-by-claude" ? "bg-[var(--accent-brand)]/15" : "bg-[var(--bg-300)]"
                  }`}>
                    {key.source.type === "created-by-claude" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-brand)">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-000)]">{key.name}</span>
                      {key.source.type === "created-by-claude" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-brand)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-brand)]">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                          Created by Claude{key.source.provider ? ` via ${key.source.provider}` : ""}
                        </span>
                      )}
                      {key.source.type === "imported" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(210,66%,67%)]/10 px-2 py-0.5 text-[10px] font-medium text-[hsl(210,66%,67%)]">
                          Imported from {key.source.provider}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-[10px] text-[var(--text-500)]" style={{ fontFamily: "var(--font-mono)" }}>{key.prefix}</code>
                    </div>
                  </div>
                </div>

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
      ))}
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
          <h2 className="text-sm font-semibold text-[var(--text-000)]">Agent Activity</h2>
          <span className="text-[10px] text-[var(--text-500)]">Autonomous key provisioning</span>
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
                  entry.action === "Claimed by human" ? "bg-[hsl(97,59%,46%)]" :
                  entry.action === "Key provisioned" ? "bg-[var(--accent-brand)]" :
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
            <h2 className="text-sm font-semibold text-[var(--text-000)]">Claude Keys Protocol</h2>
            <p className="text-xs text-[var(--text-400)]">
              Services that enroll in the Claude Keys Protocol allow Claude to autonomously provision and manage API keys on your behalf. A human can claim ownership at any time.
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
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-300)] text-lg">
                {service.icon}
              </span>
              <div>
                <div className="text-sm font-medium text-[var(--text-000)]">{service.name}</div>
                {service.keysProvisioned > 0 ? (
                  <div className="text-[11px] text-[var(--text-400)]">
                    {service.keysProvisioned} key{service.keysProvisioned !== 1 ? "s" : ""} provisioned · last {service.lastProvisioned}
                  </div>
                ) : (
                  <div className="text-[11px] text-[var(--text-500)]">
                    No keys provisioned yet
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
