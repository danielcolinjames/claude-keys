"use client";

import { Shell } from "@/components/shell";
import { environments } from "@/lib/mock-data";

const policies = [
  {
    id: "pol_1",
    name: "Production Safety",
    environment: "production",
    keys: ["production-api", "agent-prod"],
    approver: "Sarah Kim (CTO)",
    rules: [
      { label: "Allowed Models", value: "Opus 4.6, Sonnet 4.5, Haiku 4.5" },
      { label: "Max Accesses / Day", value: "10,000" },
      { label: "Rate Limit", value: "1,000 req/min" },
      { label: "IP Allowlist", value: "52.14.0.0/16, 95.216.0.0/16" },
    ],
    enabled: true,
  },
  {
    id: "pol_2",
    name: "Staging Access",
    environment: "staging",
    keys: ["staging-api"],
    approver: "Marina Chen (Team Lead)",
    rules: [
      { label: "Allowed Models", value: "Sonnet 4.5, Haiku 4.5" },
      { label: "Max Accesses / Day", value: "5,000" },
      { label: "Rate Limit", value: "500 req/min" },
      { label: "IP Allowlist", value: "Office VPN + CI/CD" },
    ],
    enabled: true,
  },
  {
    id: "pol_3",
    name: "Dev Environment",
    environment: "development",
    keys: ["dev-key", "hackathon-demo"],
    approver: "Auto-approved",
    rules: [
      { label: "Allowed Models", value: "All models" },
      { label: "Max Accesses / Day", value: "5,000" },
      { label: "Rate Limit", value: "100 req/min" },
      { label: "IP Allowlist", value: "Any" },
    ],
    enabled: true,
  },
];

const envColorMap: Record<string, string> = {
  production: "hsl(97,59%,46%)",
  staging: "hsl(40,71%,50%)",
  development: "hsl(210,66%,67%)",
};

const approvalBadge: Record<string, string> = {
  cto: "bg-[hsl(0,98%,75%)]/10 text-[hsl(0,98%,75%)]",
  "team-lead": "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]",
  none: "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]",
};

export default function PoliciesPage() {
  return (
    <Shell>
      <div className="px-8 py-6 max-w-[1200px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-000)]" style={{ fontFamily: "var(--font-serif)" }}>
              Policies & Access
            </h1>
            <p className="mt-1 text-sm text-[var(--text-400)]">
              Approval workflows and guardrails by environment
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
            + Create Policy
          </button>
        </div>

        {/* Approval levels — simple horizontal cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {environments.map((env) => (
            <div key={env.id} className="rounded-xl border-0.5 bg-[var(--bg-100)] px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: env.color }} />
                <span className="text-sm font-semibold text-[var(--text-000)]">{env.label}</span>
              </div>
              <div className="text-xs text-[var(--text-400)] mb-2">New key approval</div>
              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${
                approvalBadge[env.approvalLevel]
              }`}>
                {env.approvalName}
              </span>
            </div>
          ))}
        </div>

        {/* Policies */}
        <div className="grid gap-4">
          {policies.map((policy) => {
            const env = environments.find((e) => e.name === policy.environment);
            const envColor = envColorMap[policy.environment] || "var(--text-500)";

            return (
              <div
                key={policy.id}
                className={`rounded-xl border-0.5 bg-[var(--bg-100)] ${!policy.enabled ? "opacity-60" : ""}`}
                style={{ borderColor: "var(--border-300)" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b-0.5" style={{ borderColor: "var(--border-300)" }}>
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: envColor }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-000)]">{policy.name}</h3>
                        <span className="text-[10px] text-[var(--text-500)]">· Approver: {policy.approver}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {policy.keys.map((k) => (
                          <span key={k} className="rounded bg-[var(--bg-300)] px-2 py-0.5 text-[10px] text-[var(--text-400)]" style={{ fontFamily: "var(--font-mono)" }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      policy.enabled ? "bg-[var(--accent-brand)]" : "bg-[var(--text-500)]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        policy.enabled ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Rules — simple 4-column row */}
                <div className="grid grid-cols-4">
                  {policy.rules.map((rule, i) => (
                    <div
                      key={rule.label}
                      className="px-5 py-3"
                      style={{ borderRight: i < policy.rules.length - 1 ? "0.5px solid var(--border-300)" : "none" }}
                    >
                      <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)]">{rule.label}</div>
                      <div className="mt-1 text-sm font-medium text-[var(--text-000)]">{rule.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
