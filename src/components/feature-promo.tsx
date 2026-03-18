"use client";

import { useState } from "react";

export function FeaturePromo() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg rounded-2xl border-0.5 bg-[var(--bg-100)] shadow-2xl overflow-hidden"
        style={{ borderColor: "var(--border-300)" }}
      >
        {/* Illustration area — terracotta background */}
        <div
          className="relative flex items-center justify-center py-12"
          style={{ backgroundColor: "hsl(15,50%,58%)" }}
        >
          {/* Illustration: Three Claude sparkles with a lock */}
          {/* If /claude-keys-illustration.svg exists (generated via Quiver), use it */}
          {/* Otherwise, render the inline SVG placeholder */}
          <IllustrationPlaceholder />

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
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-[var(--accent-brand)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent-brand)]">
              New
            </span>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-000)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Introducing Claude Keys
          </h2>
          <p className="text-sm text-[var(--text-300)] leading-relaxed mb-4">
            Manage your team&apos;s API keys with environment-based approval workflows,
            autonomous agent provisioning, and secrets sync — all built into Claude.
          </p>

          {/* Escalation path mini-diagram */}
          <div className="mb-4 rounded-lg bg-[var(--bg-200)] p-3">
            <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-500)] mb-2">Approval escalation by environment</div>
            <div className="flex items-center gap-2">
              <EscalationStep color="hsl(210,66%,67%)" label="Development" approval="Auto-approved" />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--text-500)" className="flex-shrink-0"><path d="M6 3l5 5-5 5" fill="none" stroke="var(--text-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <EscalationStep color="hsl(40,71%,50%)" label="Staging" approval="Team Lead" />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--text-500)" className="flex-shrink-0"><path d="M6 3l5 5-5 5" fill="none" stroke="var(--text-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <EscalationStep color="hsl(97,59%,46%)" label="Production" approval="CTO" />
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            <PromoItem>Keys grouped by project and environment with escalating approvals</PromoItem>
            <PromoItem>Claude agents provision keys autonomously — humans claim later</PromoItem>
            <PromoItem>Zero-downtime rotation synced to 1Password, AWS, Vault</PromoItem>
            <PromoItem>Full audit trail across team members and autonomous agents</PromoItem>
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
    <div className="flex-1 rounded-md bg-[var(--bg-100)] px-2.5 py-1.5">
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
    <li className="flex items-start gap-2 text-sm text-[var(--text-200)]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
        <circle cx="8" cy="8" r="7" stroke="var(--accent-brand)" strokeWidth="1" />
        <path d="M5 8l2 2 4-4" stroke="var(--accent-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}

/* ── Official Claude sparkle logo path (from claude.ai brand assets) ── */
const CLAUDE_SPARKLE_PATH =
  "M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z";

/* ── Illustration: 3 Claude logos in a row ── */
function IllustrationPlaceholder() {
  const s = 0.1;
  const y = 28;

  return (
    <svg width="240" height="110" viewBox="0 0 240 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform={`translate(42, ${y}) scale(${s})`}>
        <path d={CLAUDE_SPARKLE_PATH} fill="white" fillRule="nonzero" />
      </g>
      <g transform={`translate(88, ${y}) scale(${s})`}>
        <path d={CLAUDE_SPARKLE_PATH} fill="white" fillRule="nonzero" />
      </g>
      <g transform={`translate(134, ${y}) scale(${s})`}>
        <path d={CLAUDE_SPARKLE_PATH} fill="white" fillRule="nonzero" />
      </g>
    </svg>
  );
}
