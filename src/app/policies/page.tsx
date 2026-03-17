"use client";

import { Shell } from "@/components/shell";

const policies = [
  {
    id: "pol_1",
    name: "Production Safety",
    keys: ["production-api", "leftway-prod"],
    rules: [
      { type: "model", icon: "model", label: "Allowed Models", value: "Opus 4.6, Sonnet 4.5, Haiku 4.5" },
      { type: "spend", icon: "dollar", label: "Max Spend / Day", value: "$500" },
      { type: "tokens", icon: "token", label: "Max Tokens / Request", value: "200,000" },
      { type: "rate", icon: "clock", label: "Rate Limit", value: "1,000 req/min" },
      { type: "ip", icon: "shield", label: "IP Allowlist", value: "52.14.0.0/16, 34.102.0.0/16" },
    ],
    enabled: true,
  },
  {
    id: "pol_2",
    name: "Dev Environment",
    keys: ["claude-code-dev", "hackathon-demo"],
    rules: [
      { type: "model", icon: "model", label: "Allowed Models", value: "All models" },
      { type: "spend", icon: "dollar", label: "Max Spend / Day", value: "$100" },
      { type: "tokens", icon: "token", label: "Max Tokens / Request", value: "500,000" },
      { type: "rate", icon: "clock", label: "Rate Limit", value: "100 req/min" },
      { type: "ip", icon: "shield", label: "IP Allowlist", value: "Any" },
    ],
    enabled: true,
  },
  {
    id: "pol_3",
    name: "Haiku Only (Cost Control)",
    keys: ["being-agent"],
    rules: [
      { type: "model", icon: "model", label: "Allowed Models", value: "Haiku 4.5 only" },
      { type: "spend", icon: "dollar", label: "Max Spend / Day", value: "$10" },
      { type: "tokens", icon: "token", label: "Max Tokens / Request", value: "50,000" },
      { type: "time", icon: "calendar", label: "Time Window", value: "24/7" },
      { type: "rate", icon: "clock", label: "Rate Limit", value: "200 req/min" },
    ],
    enabled: true,
  },
  {
    id: "pol_4",
    name: "Business Hours Only",
    keys: [],
    rules: [
      { type: "model", icon: "model", label: "Allowed Models", value: "Sonnet 4.5, Haiku 4.5" },
      { type: "spend", icon: "dollar", label: "Max Spend / Day", value: "$200" },
      { type: "time", icon: "calendar", label: "Time Window", value: "Mon-Fri, 9am-6pm ET" },
      { type: "ip", icon: "shield", label: "IP Allowlist", value: "Office VPN only" },
    ],
    enabled: false,
  },
];

export default function PoliciesPage() {
  return (
    <Shell>
      <div className="px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
              Key Policies
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Define guardrails for how your API keys can be used
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]">
            + Create Policy
          </button>
        </div>

        <div className="grid gap-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={`rounded-xl border bg-[var(--bg-surface)] transition-colors ${
                policy.enabled ? "border-[var(--border-subtle)]" : "border-[var(--border-subtle)] opacity-60"
              }`}
            >
              {/* Policy header */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${policy.enabled ? "bg-[var(--accent-primary)]/10" : "bg-[var(--bg-elevated)]"}`}>
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={policy.enabled ? "var(--accent-primary)" : "var(--text-subtle)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 1.5 2.5 4v3.5c0 3.5 2.35 6.27 5.5 7 3.15-.73 5.5-3.5 5.5-7V4L8 1.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{policy.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      {policy.keys.length > 0 ? (
                        policy.keys.map((k) => (
                          <span key={k} className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-[var(--font-mono)] text-[10px] text-[var(--text-muted)]">
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--text-subtle)]">No keys assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)]">{policy.enabled ? "Enabled" : "Disabled"}</span>
                  <button
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      policy.enabled ? "bg-[var(--accent-primary)]" : "bg-[var(--text-subtle)]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        policy.enabled ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Rules grid */}
              <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
                {policy.rules.map((rule, i) => (
                  <div
                    key={rule.type}
                    className={`px-5 py-3.5 ${
                      i < policy.rules.length - (policy.rules.length % 3 === 0 ? 3 : policy.rules.length % 3)
                        ? "border-b border-[var(--border-subtle)]"
                        : ""
                    } ${i % 3 !== 2 ? "border-r border-[var(--border-subtle)]" : ""}`}
                  >
                    <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)]">
                      {rule.label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                      {rule.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
