"use client";

import { useState } from "react";
import { Shell } from "@/components/shell";
import { Sparkline } from "@/components/sparkline";
import { FeaturePromo } from "@/components/feature-promo";
import {
  keys,
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

const envColors: Record<string, string> = {
  production: "border-[hsl(97,59%,46%)]/30 text-[hsl(97,59%,46%)]",
  staging: "border-[hsl(40,71%,50%)]/30 text-[hsl(40,71%,50%)]",
  development: "border-[hsl(210,66%,67%)]/30 text-[hsl(210,66%,67%)]",
};

type Tab = "keys" | "activity" | "services";

const tabs: { id: Tab; label: string }[] = [
  { id: "keys", label: "All keys" },
  { id: "activity", label: "Activity" },
  { id: "services", label: "Services" },
];

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
          {tabs.map((tab) => (
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

/* ── Tab 1: All Keys ── */
function KeysTab() {
  return (
    <div className="rounded-xl border-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
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
            {/* Name + env badge + source */}
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                key.source.type === "created-by-claude" ? "bg-[var(--accent-brand)]/15" : "bg-[var(--bg-300)]"
              }`}>
                {key.source.type === "created-by-claude" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-brand)">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-400)" strokeWidth="1.5">
                    <path d="M10.5 1.5a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3z" />
                    <path d="M8.12 6.38 1.5 13v1.5H4l.75-.75v-1.5h1.5l.75-.75v-1.5h1.5l1.62-1.62" />
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
                      {key.source.providerIcon} Imported from {key.source.provider}
                    </span>
                  )}
                </div>
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
