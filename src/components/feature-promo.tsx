"use client";

import { useState } from "react";

export function FeaturePromo() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-[580px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid var(--border-300)" }}
      >
        {/* Hero — terracotta with access request illustration */}
        <div
          className="relative px-10 pt-10 pb-8"
          style={{
            background: "linear-gradient(160deg, hsl(15,50%,58%) 0%, hsl(15,45%,48%) 100%)",
          }}
        >
          {/* Access request card — frosted glass, illustration style */}
          <div
            className="rounded-xl px-6 py-5"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" opacity="0.9">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-[13px] text-white/80">Claude wants to use</span>
              <span
                className="text-[13px] font-medium text-white bg-white/12 px-2 py-0.5 rounded-md"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Datadog Production
              </span>
            </div>
            <p className="text-[12px] text-white/50 mb-4 ml-[26px]">Check error logs for production outage</p>
            <div className="flex gap-2 ml-[26px]">
              <button className="flex-1 rounded-lg bg-white/18 py-2.5 text-[12px] font-medium text-white transition-all hover:bg-white/25">
                Escalate to CTO
              </button>
              <button className="flex-1 rounded-lg bg-white/8 py-2.5 text-[12px] text-white/60 transition-all hover:bg-white/12">
                Deny
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-white/70 transition-all hover:bg-black/30 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="bg-[var(--bg-100)] px-10 py-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="rounded-full bg-[var(--accent-brand)]/12 px-3 py-1 text-[11px] font-semibold text-[var(--accent-brand)] tracking-wide">
              New
            </span>
          </div>

          <h2
            className="text-[22px] font-medium text-[var(--text-000)] mb-2.5 tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Introducing Claude Keys
          </h2>
          <p className="text-[14px] text-[var(--text-300)] leading-[1.6] mb-6 max-w-[440px]">
            Give Claude safe access to your team&apos;s API keys. Every time Claude needs a key,
            it requests permission from the right person.
          </p>

          {/* Escalation path */}
          <div className="mb-6 rounded-xl bg-[var(--bg-200)] p-4">
            <div className="flex items-center gap-2.5">
              <EscalationStep color="hsl(210,66%,67%)" label="Development" approval="Auto-approved" />
              <ChevronRight />
              <EscalationStep color="hsl(40,71%,50%)" label="Staging" approval="Team Lead" />
              <ChevronRight />
              <EscalationStep color="hsl(97,59%,46%)" label="Production" approval="CTO" />
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            <PromoItem>Claude requests access — the right person approves every time</PromoItem>
            <PromoItem>Environment-based escalation from dev to production</PromoItem>
            <PromoItem>Full audit trail of every access request and approval</PromoItem>
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl bg-[var(--accent-brand)] px-6 py-3 text-[14px] font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
            >
              Get Started
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl px-6 py-3 text-[14px] font-medium text-[var(--text-400)] transition-all duration-150 hover:text-[var(--text-200)]"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" className="flex-shrink-0 text-[var(--text-500)]">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EscalationStep({ color, label, approval }: { color: string; label: string; approval: string }) {
  return (
    <div className="flex-1 rounded-lg bg-[var(--bg-100)] px-3 py-2.5">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[12px] font-medium text-[var(--text-000)]">{label}</span>
      </div>
      <div className="text-[11px] text-[var(--text-400)]">{approval}</div>
    </div>
  );
}

function PromoItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[13px] text-[var(--text-200)] leading-relaxed">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
        <circle cx="8" cy="8" r="7" stroke="var(--accent-brand)" strokeWidth="1" opacity="0.5" />
        <path d="M5 8l2 2 4-4" stroke="var(--accent-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}
