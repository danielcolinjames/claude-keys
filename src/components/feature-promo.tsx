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
            Manage your API keys with team-aware access controls, environment-based approval
            workflows, and automatic rotation — all built into Claude.
          </p>
          <ul className="space-y-2 mb-6">
            <PromoItem>Environment-based approval escalation (dev → staging → production)</PromoItem>
            <PromoItem>Team access controls with per-member usage tracking</PromoItem>
            <PromoItem>Zero-downtime key rotation with 1Password & AWS sync</PromoItem>
            <PromoItem>Real-time Claude access monitoring across all projects</PromoItem>
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

/* ── Placeholder illustration: 3 Claude sparkles + lock ── */
function IllustrationPlaceholder() {
  return (
    <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three Claude sparkle symbols */}
      <g transform="translate(40, 30)">
        <ClaudeSparkle size={40} />
      </g>
      <g transform="translate(100, 20)">
        <ClaudeSparkle size={50} />
      </g>
      <g transform="translate(170, 30)">
        <ClaudeSparkle size={40} />
      </g>

      {/* Lock icon in center-bottom */}
      <g transform="translate(105, 80)">
        <rect x="2" y="14" width="26" height="20" rx="3" fill="white" opacity="0.9" />
        <path
          d="M8 14V10C8 6.68629 10.6863 4 14 4H16C19.3137 4 22 6.68629 22 10V14"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="15" cy="24" r="2" fill="rgba(0,0,0,0.5)" />
      </g>

      {/* Organic connecting lines (hand-drawn feel) */}
      <path
        d="M75 55 C85 45, 95 45, 105 40"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M165 55 C155 45, 145 45, 135 40"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Inline Claude sparkle (the 12-arm starburst) ── */
function ClaudeSparkle({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const arms = 12;
  const innerR = size * 0.18;
  const outerR = size * 0.48;
  const tipW = size * 0.06;

  const paths: string[] = [];
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2 - Math.PI / 2;
    const perpAngle = angle + Math.PI / 2;

    const tipX = cx + Math.cos(angle) * outerR;
    const tipY = cy + Math.sin(angle) * outerR;
    const baseX1 = cx + Math.cos(angle) * innerR + Math.cos(perpAngle) * tipW;
    const baseY1 = cy + Math.sin(angle) * innerR + Math.sin(perpAngle) * tipW;
    const baseX2 = cx + Math.cos(angle) * innerR - Math.cos(perpAngle) * tipW;
    const baseY2 = cy + Math.sin(angle) * innerR - Math.sin(perpAngle) * tipW;

    paths.push(`M${baseX1},${baseY1} L${tipX},${tipY} L${baseX2},${baseY2}`);
  }

  return (
    <>
      <circle cx={cx} cy={cy} r={innerR} fill="white" opacity="0.95" />
      {paths.map((d, i) => (
        <path key={i} d={d} fill="white" opacity="0.95" />
      ))}
    </>
  );
}
