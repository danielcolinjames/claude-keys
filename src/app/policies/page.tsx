"use client";

import { Shell } from "@/components/shell";
import { environments } from "@/lib/mock-data";

const policies = [
  {
    id: "pol_1",
    name: "Production Safety",
    environment: "production",
    keys: ["production-api", "agent-prod"],
    approvalLevel: "cto" as const,
    approver: "Sarah Kim (CTO)",
    rules: [
      { label: "Allowed Models", value: "Opus 4.6, Sonnet 4.5, Haiku 4.5" },
      { label: "Max Accesses / Day", value: "10,000" },
      { label: "Max Tokens / Request", value: "200,000" },
      { label: "Rate Limit", value: "1,000 req/min" },
      { label: "IP Allowlist", value: "52.14.0.0/16, 95.216.0.0/16" },
      { label: "New Key Approval", value: "Requires CTO sign-off" },
    ],
    enabled: true,
  },
  {
    id: "pol_2",
    name: "Staging Access",
    environment: "staging",
    keys: ["staging-api"],
    approvalLevel: "team-lead" as const,
    approver: "Marina Chen (Team Lead)",
    rules: [
      { label: "Allowed Models", value: "Sonnet 4.5, Haiku 4.5" },
      { label: "Max Accesses / Day", value: "5,000" },
      { label: "Max Tokens / Request", value: "500,000" },
      { label: "Rate Limit", value: "500 req/min" },
      { label: "IP Allowlist", value: "Office VPN + CI/CD" },
      { label: "New Key Approval", value: "Team Lead review" },
    ],
    enabled: true,
  },
  {
    id: "pol_3",
    name: "Dev Environment",
    environment: "development",
    keys: ["dev-key", "hackathon-demo"],
    approvalLevel: "none" as const,
    approver: "Auto-approved",
    rules: [
      { label: "Allowed Models", value: "All models" },
      { label: "Max Accesses / Day", value: "5,000" },
      { label: "Max Tokens / Request", value: "500,000" },
      { label: "Rate Limit", value: "100 req/min" },
      { label: "IP Allowlist", value: "Any" },
      { label: "New Key Approval", value: "Self-service" },
    ],
    enabled: true,
  },
  {
    id: "pol_4",
    name: "Business Hours Only",
    environment: "production",
    keys: [],
    approvalLevel: "vp-eng" as const,
    approver: "VP Engineering",
    rules: [
      { label: "Allowed Models", value: "Sonnet 4.5, Haiku 4.5" },
      { label: "Max Accesses / Day", value: "3,000" },
      { label: "Time Window", value: "Mon–Fri, 9am–6pm ET" },
      { label: "New Key Approval", value: "VP Engineering sign-off" },
    ],
    enabled: false,
  },
];

const approvalColors: Record<string, { badge: string; label: string }> = {
  "none": { badge: "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]", label: "Auto-approved" },
  "team-lead": { badge: "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]", label: "Team Lead" },
  "vp-eng": { badge: "bg-[hsl(15,63%,60%)]/10 text-[hsl(15,63%,60%)]", label: "VP Engineering" },
  "cto": { badge: "bg-[hsl(0,98%,75%)]/10 text-[hsl(0,98%,75%)]", label: "CTO Required" },
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
              Approval workflows, guardrails, and environment permissions
            </p>
          </div>
          <button className="rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 active:scale-[0.98]">
            + Create Policy
          </button>
        </div>

        {/* Approval Escalation Overview */}
        <div className="mb-6 rounded-xl border-0.5 bg-[var(--bg-100)] p-5" style={{ borderColor: "var(--border-300)" }}>
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-000)]">Approval Escalation</h2>
          <div className="flex items-center gap-3">
            {environments.map((env, i) => (
              <div key={env.id} className="flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-[var(--bg-200)] px-4 py-3 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: env.color }} />
                    <span className="text-sm font-medium text-[var(--text-000)]">{env.label}</span>
                  </div>
                  <div className="text-xs text-[var(--text-400)] mb-1.5">{env.approvalName}</div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    env.approvalLevel === "cto" ? "bg-[hsl(0,98%,75%)]/10 text-[hsl(0,98%,75%)]" :
                    env.approvalLevel === "team-lead" ? "bg-[hsl(40,71%,50%)]/10 text-[hsl(40,71%,50%)]" :
                    "bg-[hsl(97,59%,46%)]/10 text-[hsl(97,59%,46%)]"
                  }`}>
                    {env.approvalLevel === "none" ? "No approval needed" : `Escalated to ${env.approvalName}`}
                  </span>
                </div>
                {i < environments.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-500)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="grid gap-4">
          {policies.map((policy) => {
            const approval = approvalColors[policy.approvalLevel];
            const env = environments.find((e) => e.name === policy.environment);
            return (
              <div
                key={policy.id}
                className={`rounded-xl border-0.5 bg-[var(--bg-100)] transition-colors ${
                  policy.enabled ? "" : "opacity-60"
                }`}
                style={{ borderColor: "var(--border-300)" }}
              >
                {/* Policy header */}
                <div className="flex items-center justify-between border-b-0.5 px-5 py-4" style={{ borderColor: "var(--border-300)" }}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${policy.enabled ? "bg-[var(--accent-brand)]/10" : "bg-[var(--bg-300)]"}`}>
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={policy.enabled ? "var(--accent-brand)" : "var(--text-500)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 1.5 2.5 4v3.5c0 3.5 2.35 6.27 5.5 7 3.15-.73 5.5-3.5 5.5-7V4L8 1.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-000)]">{policy.name}</h3>
                        {env && (
                          <span className="rounded border-0.5 px-1.5 py-0 text-[10px]" style={{ borderColor: env.color + "50", color: env.color }}>
                            {env.label}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        {policy.keys.length > 0 ? (
                          policy.keys.map((k) => (
                            <span key={k} className="rounded bg-[var(--bg-300)] px-2 py-0.5 text-[10px] text-[var(--text-400)]" style={{ fontFamily: "var(--font-mono)" }}>
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[var(--text-500)]">No keys assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Approval level badge */}
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${approval.badge}`}>
                      {approval.label}
                    </span>
                    <span className="text-xs text-[var(--text-400)]">Approver: {policy.approver}</span>

                    {/* Toggle */}
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
                </div>

                {/* Rules grid */}
                <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
                  {policy.rules.map((rule, i) => (
                    <div
                      key={rule.label}
                      className="px-5 py-3.5"
                      style={{
                        borderBottom: i < policy.rules.length - (policy.rules.length % 3 === 0 ? 3 : policy.rules.length % 3) ? "0.5px solid var(--border-300)" : "none",
                        borderRight: i % 3 !== 2 ? "0.5px solid var(--border-300)" : "none",
                      }}
                    >
                      <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)]">
                        {rule.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-[var(--text-000)]">
                        {rule.value}
                      </div>
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
