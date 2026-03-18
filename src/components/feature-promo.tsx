"use client";

import { useState } from "react";

export function FeaturePromo() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xl rounded-2xl border-0.5 bg-[var(--bg-100)] shadow-2xl overflow-hidden"
        style={{ borderColor: "var(--border-300)" }}
      >
        {/* Hero illustration area — terracotta background with access request */}
        <div
          className="relative px-10 py-10"
          style={{ backgroundColor: "hsl(15,50%,58%)" }}
        >
          {/* Simplified access request card — illustration style */}
          <div className="rounded-xl bg-white/15 backdrop-blur-sm px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" opacity="0.9"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              <span className="text-sm text-white/90">Claude wants to use</span>
              <span className="text-sm font-medium text-white bg-white/15 px-2 py-0.5 rounded-md">Datadog Production</span>
            </div>
            <p className="text-xs text-white/60 mb-4 ml-[22px]">Check error logs for production outage</p>
            <div className="flex gap-2 ml-[22px]">
              <button className="flex-1 rounded-lg bg-white/20 py-2 text-xs font-medium text-white">
                Escalate to CTO
              </button>
              <button className="flex-1 rounded-lg bg-white/10 py-2 text-xs text-white/70">
                Deny
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white/80 transition hover:bg-black/40 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-[var(--accent-brand)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-brand)]">
              New
            </span>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-000)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Introducing Claude Keys
          </h2>
          <p className="text-sm text-[var(--text-300)] leading-relaxed mb-5">
            Give Claude safe access to your team&apos;s API keys. Every time Claude needs a key,
            it requests permission from the right person based on the environment.
          </p>

          {/* Escalation path */}
          <div className="mb-5 rounded-lg bg-[var(--bg-200)] p-3">
            <div className="flex items-center gap-2">
              <EscalationStep color="hsl(210,66%,67%)" label="Development" approval="Auto-approved" />
              <svg width="12" height="12" viewBox="0 0 16 16" className="flex-shrink-0"><path d="M6 3l5 5-5 5" fill="none" stroke="var(--text-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <EscalationStep color="hsl(40,71%,50%)" label="Staging" approval="Team Lead" />
              <svg width="12" height="12" viewBox="0 0 16 16" className="flex-shrink-0"><path d="M6 3l5 5-5 5" fill="none" stroke="var(--text-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <EscalationStep color="hsl(97,59%,46%)" label="Production" approval="CTO" />
            </div>
          </div>

          <ul className="space-y-2.5 mb-6">
            <PromoItem>Claude requests access — the right person approves every time</PromoItem>
            <PromoItem>Environment-based escalation: dev auto-approves, prod requires CTO</PromoItem>
            <PromoItem>Full audit trail of every access request, approval, and denial</PromoItem>
          </ul>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[var(--accent-brand)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              Get Started
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--text-400)] transition hover:text-[var(--text-000)]"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EscalationStep({ color, label, approval }: { color: string; label: string; approval: string }) {
  return (
    <div className="flex-1 rounded-md bg-[var(--bg-100)] px-2.5 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-medium text-[var(--text-000)]">{label}</span>
      </div>
      <div className="text-[10px] text-[var(--text-400)]">{approval}</div>
    </div>
  );
}

function PromoItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[var(--text-200)]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
        <circle cx="8" cy="8" r="7" stroke="var(--accent-brand)" strokeWidth="1" />
        <path d="M5 8l2 2 4-4" stroke="var(--accent-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}
