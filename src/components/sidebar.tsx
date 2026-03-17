"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Keys", icon: KeyIcon },
  { href: "/policies", label: "Policies", icon: ShieldIcon },
  { href: "/analytics", label: "Analytics", icon: ChartIcon },
  { href: "/rotation", label: "Rotation & Secrets", icon: RotateIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4h3v3H4V4zm5 0h3v3H9V4zM4 9h3v3H4V9zm5 0h3v3H9V9z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
        <span className="font-[var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Claude Keys
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border-subtle)] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-xs font-medium text-[var(--text-secondary)]">
            DJ
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-[var(--text-primary)]">Daniel James</span>
            <span className="text-xs text-[var(--text-muted)]">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function KeyIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? "var(--accent-primary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 1.5a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3z" />
      <path d="M8.12 6.38 1.5 13v1.5H4l.75-.75v-1.5h1.5l.75-.75v-1.5h1.5l1.62-1.62" />
    </svg>
  );
}

function ShieldIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? "var(--accent-primary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5 2.5 4v3.5c0 3.5 2.35 6.27 5.5 7 3.15-.73 5.5-3.5 5.5-7V4L8 1.5z" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? "var(--accent-primary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 14.5h13M3.5 14.5V9M6.5 14.5V6M9.5 14.5V8M12.5 14.5V3" />
    </svg>
  );
}

function RotateIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? "var(--accent-primary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 2.5v4h4M14.5 13.5v-4h-4" />
      <path d="M13.66 5.84A5.5 5.5 0 0 0 3.04 3.96L1.5 6.5M2.34 10.16a5.5 5.5 0 0 0 10.62 1.88l1.54-2.54" />
    </svg>
  );
}
