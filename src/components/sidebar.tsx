"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

/* ── Three Claude sparkle logos (*** motif) — all same size ── */
function ClaudeSparkles() {
  return (
    <span className="ml-auto flex items-center gap-[2px]">
      <Image src="/claude-sparkle.png" alt="" width={12} height={12} className="opacity-80" />
      <Image src="/claude-sparkle.png" alt="" width={12} height={12} className="opacity-80" />
      <Image src="/claude-sparkle.png" alt="" width={12} height={12} className="opacity-80" />
    </span>
  );
}

/* ── Sub-navigation for Keys section ── */
const keysSubNav = [
  { href: "/", label: "Dashboard" },
  { href: "/policies", label: "Policies & Access" },
  { href: "/analytics", label: "Activity" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r-0.5 bg-[var(--bg-100)]" style={{ borderColor: "var(--border-300)" }}>
      {/* Top actions */}
      <div className="flex flex-col px-2 pt-2 gap-px">
        {/* New Chat */}
        <a
          href="https://claude.ai/new"
          className="group flex h-8 w-full items-center gap-3 rounded-lg px-4 py-1.5 text-xs text-[var(--text-200)] transition-colors duration-75 hover:bg-[var(--bg-300)] active:bg-[var(--bg-300)]"
        >
          <div className="flex items-center justify-center text-[var(--text-100)]">
            <div className="flex items-center justify-center rounded-full transition-all ease-in-out group-hover:-rotate-3 group-hover:scale-110 group-active:rotate-6 group-active:scale-[0.98]">
              <div className="flex items-center justify-center rounded-full size-[1.4rem] -mx-[0.2rem] bg-[var(--text-500)]/15 group-hover:bg-[var(--text-500)]/25">
                <PlusIcon />
              </div>
            </div>
          </div>
          <span className="text-sm">New chat</span>
        </a>

        {/* Search */}
        <a
          href="https://claude.ai/recents"
          className="group flex h-8 w-full items-center gap-3 rounded-lg px-4 py-1.5 text-xs text-[var(--text-200)] transition-colors duration-75 hover:bg-[var(--bg-300)] active:bg-[var(--bg-300)]"
        >
          <div className="flex items-center justify-center text-[var(--text-100)]" style={{ width: 16, height: 16 }}>
            <SearchIcon />
          </div>
          <span className="text-sm">Search</span>
        </a>

        {/* Customize */}
        <a
          href="https://claude.ai/customize"
          className="group flex h-8 w-full items-center gap-3 rounded-lg px-4 py-1.5 text-xs text-[var(--text-200)] transition-colors duration-75 hover:bg-[var(--bg-300)] active:bg-[var(--bg-300)]"
        >
          <div className="flex items-center justify-center text-[var(--text-100)]">
            <div className="flex items-center justify-center transition-all ease-in-out group-hover:-rotate-3 group-hover:scale-110 group-active:rotate-6 group-active:scale-[0.98]">
              <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CustomizeIcon />
              </div>
            </div>
          </div>
          <span className="text-sm">Customize</span>
        </a>
      </div>

      {/* Main nav */}
      <div className="flex flex-grow flex-col overflow-x-hidden overflow-y-auto border-t-0.5 border-transparent mt-1">
        <div className="flex flex-col px-2 pt-4 gap-px">
          {/* Chats */}
          <NavLink href="https://claude.ai/recents" label="Chats" icon={<ChatsIcon />} />
          {/* Projects */}
          <NavLink href="https://claude.ai/projects" label="Projects" icon={<ProjectsIcon />} />
          {/* Artifacts */}
          <NavLink href="https://claude.ai/artifacts" label="Artifacts" icon={<ArtifactsIcon />} />
          {/* Code */}
          <NavLink href="https://claude.ai/code" label="Code" icon={<CodeIcon />} external />

          {/* ── Keys Section (Active) ── */}
          <div className="mt-1">
            <div className="flex h-8 w-full items-center gap-3 rounded-lg px-4 py-1.5 bg-[var(--bg-300)] text-[var(--text-000)]">
              <div className="flex items-center justify-center" style={{ width: 16, height: 16 }}>
                <KeysIcon />
              </div>
              <span className="text-sm font-medium">Keys</span>
              <ClaudeSparkles />
            </div>

            {/* Sub-navigation */}
            <div className="ml-[22px] mt-0.5 flex flex-col gap-px border-l border-[var(--border-subtle)] pl-3">
              {keysSubNav.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-md px-2.5 py-1 text-[13px] transition-colors duration-75 ${
                      active
                        ? "bg-[var(--bg-200)] text-[var(--text-000)] font-medium"
                        : "text-[var(--text-400)] hover:text-[var(--text-200)] hover:bg-[var(--bg-200)]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="border-t-0.5 px-2 py-4" style={{ borderColor: "var(--border-300)", backgroundColor: "var(--bg-100)" }}>
        <button className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--bg-300)]">
          <div className="relative flex-shrink-0">
            <div className="flex items-center justify-center rounded-full border-0.5 border-transparent transition group-hover:border-[var(--border-200)] group-hover:opacity-90">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" fill="#6A9BCC" />
                <text x="14" y="18" textAnchor="middle" fill="white" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500">D</text>
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between text-sm font-medium min-w-0">
            <div className="flex flex-col items-start min-w-0 flex-1 pr-1">
              <span className="w-full text-start block truncate text-[var(--text-000)]">Daniel James</span>
              <span className="w-full truncate text-xs text-[var(--text-500)] font-normal text-start">Pro plan</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="flex-shrink-0 text-[var(--text-400)]">
                <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}

/* ── Shared nav link component ── */
function NavLink({ href, label, icon, external }: { href: string; label: string; icon: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      className="group flex h-8 w-full items-center gap-3 rounded-lg px-4 py-1.5 text-[var(--text-200)] transition-colors duration-75 hover:bg-[var(--bg-300)] active:bg-[var(--bg-300)]"
    >
      <div className="flex items-center justify-center text-[var(--text-100)]" style={{ width: 16, height: 16 }}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </a>
  );
}

/* ── Icons (matching claude.ai exactly) ── */

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)] group-hover:text-[var(--text-000)]" style={{ flexShrink: 0 }}>
      <path d="M10 3C10.4142 3 10.75 3.33579 10.75 3.75V9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.3882 16.7051 10.7075 16.3271 10.7461L16.25 10.75H10.75V16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25V10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H9.25V3.75C9.25 3.33579 9.58579 3 10 3Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path d="M8.5 2C12.0899 2 15 4.91015 15 8.5C15 10.1149 14.4094 11.5908 13.4346 12.7275L17.8535 17.1465L17.918 17.2246C18.0461 17.4187 18.0244 17.6827 17.8535 17.8535C17.6827 18.0244 17.4187 18.0461 17.2246 17.918L17.1465 17.8535L12.7275 13.4346C11.5908 14.4094 10.1149 15 8.5 15C4.91015 15 2 12.0899 2 8.5C2 4.91015 4.91015 2 8.5 2ZM8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C11.5376 14 14 11.5376 14 8.5C14 5.46243 11.5376 3 8.5 3Z" />
    </svg>
  );
}

function CustomizeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path d="M12.5 3C13.3284 3 14 3.67157 14 4.5V6H14.5C16.433 6 18 7.567 18 9.5V15.5C18 16.3284 17.3284 17 16.5 17H3.5C2.72334 17 2.08461 16.4097 2.00781 15.6533L2 15.5V9.5C2 7.567 3.567 6 5.5 6H6V4.5C6 3.67157 6.67157 3 7.5 3H12.5ZM3 15.5L3.00977 15.6006C3.05629 15.8286 3.25829 16 3.5 16H16.5C16.7761 16 17 15.7761 17 15.5V12H13V12.5C13 12.7761 12.7761 13 12.5 13C12.2239 13 12 12.7761 12 12.5V12H8V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V12H3V15.5ZM5.5 7C4.11929 7 3 8.11929 3 9.5V11H7V10.5C7 10.2239 7.22386 10 7.5 10C7.77614 10 8 10.2239 8 10.5V11H12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V11H17V9.5C17 8.11929 15.8807 7 14.5 7H5.5ZM7.5 4C7.22386 4 7 4.22386 7 4.5V6H13V4.5C13 4.22386 12.7761 4 12.5 4H7.5Z" />
    </svg>
  );
}

function ChatsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path d="M8.99962 2C12.3133 2 14.9996 4.68629 14.9996 8C14.9996 11.3137 12.3133 14 8.99962 14H2.49962C2.30105 13.9998 2.12113 13.8821 2.04161 13.7002C1.96224 13.5181 1.99835 13.3058 2.1334 13.1602L3.93516 11.2178C3.34317 10.2878 2.99962 9.18343 2.99962 8C2.99962 4.68643 5.68609 2.00022 8.99962 2ZM8.99962 3C6.23838 3.00022 3.99961 5.23871 3.99961 8C3.99961 9.11212 4.36265 10.1386 4.97618 10.9688C5.11884 11.1621 5.1035 11.4293 4.94004 11.6055L3.64512 13H8.99962C11.761 13 13.9996 10.7614 13.9996 8C13.9996 5.23858 11.761 3 8.99962 3Z" />
      <path d="M16.5445 9.72754C16.4182 9.53266 16.1678 9.44648 15.943 9.53418C15.7183 9.62215 15.5932 9.85502 15.6324 10.084L15.7369 10.3955C15.9073 10.8986 16.0006 11.438 16.0006 12C16.0006 13.1123 15.6376 14.1386 15.024 14.9687C14.8811 15.1621 14.8956 15.4302 15.0592 15.6064L16.3531 17H11.0006C9.54519 17 8.23527 16.3782 7.32091 15.3848L7.07091 15.1103C6.88996 14.9645 6.62535 14.9606 6.43907 15.1143C6.25267 15.2682 6.20668 15.529 6.31603 15.7344L6.58458 16.0625C7.68048 17.253 9.25377 18 11.0006 18H17.5006C17.6991 17.9998 17.8791 17.8822 17.9586 17.7002C18.038 17.5181 18.0018 17.3058 17.8668 17.1602L16.0631 15.2178C16.6554 14.2876 17.0006 13.1837 17.0006 12C17.0006 11.3271 16.8891 10.6792 16.6842 10.0742L16.5445 9.72754Z" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path d="M15.8198 7C16.6885 7.00025 17.3624 7.73158 17.3178 8.57617L17.2993 8.74707L16.1332 15.7471C16.0126 16.4699 15.3865 16.9996 14.6538 17H5.34711C4.6142 16.9998 3.98833 16.47 3.86762 15.7471L2.7016 8.74707C2.54922 7.83277 3.25418 7 4.18109 7H15.8198ZM4.18109 8C3.87216 8 3.63722 8.27731 3.68793 8.58203L4.85394 15.582C4.89413 15.8229 5.10291 15.9998 5.34711 16H14.6538C14.8978 15.9996 15.1068 15.8228 15.1469 15.582L16.3129 8.58203L16.3188 8.46973C16.3036 8.21259 16.0899 8.00023 15.8198 8H4.18109Z" />
      <path d="M16.0004 5.5C16.0004 5.224 15.7764 5.00024 15.5004 5H4.50043C4.22428 5 4.00043 5.22386 4.00043 5.5C4.00043 5.77614 4.22428 6 4.50043 6H15.5004C15.7764 5.99976 16.0004 5.776 16.0004 5.5Z" />
      <path d="M14.5004 3.5C14.5004 3.224 14.2764 3.00024 14.0004 3H6.00043C5.72428 3 5.50043 3.22386 5.50043 3.5C5.50043 3.77614 5.72428 4 6.00043 4H14.0004C14.2764 3.99976 14.5004 3.776 14.5004 3.5Z" />
    </svg>
  );
}

function ArtifactsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.35352 3.1464L9.35352 6.14642C9.43935 6.25103 9.5 6.36003 9.5 6.50091C9.4998 6.6332 9.44704 6.75988 9.35352 6.85346L6.35352 9.85347C6.14584 10.0609 5.85611 10.0243 5.64648 9.85347L2.64648 6.85346C2.55296 6.75988 2.5002 6.6332 2.5 6.50091C2.5 6.36841 2.55285 6.24017 2.64648 6.14642L5.64648 3.1464C5.8552 2.97421 6.14635 2.93936 6.35352 3.1464ZM6 8.79194L3.70703 6.49994L6 4.20696L8.29297 6.49994L6 8.79194Z" />
      <path d="M16.8984 3.7509C16.9875 3.90632 16.986 4.09826 16.8955 4.25286L15.5791 6.49994L16.8955 8.74702C16.986 8.90159 16.9874 9.09354 16.8984 9.24898C16.8093 9.40436 16.643 9.49996 16.4638 9.49996H11.5C11.3198 9.49996 11.1532 9.4028 11.0644 9.24605C10.976 9.08949 10.9789 8.89736 11.0713 8.74312L12.417 6.49994L11.0713 4.25676C10.9789 4.1025 10.976 3.91037 11.0644 3.75383C11.1532 3.59717 11.3199 3.49992 11.5 3.49992H16.4638C16.6429 3.51309 16.8055 3.58909 16.8984 3.7509ZM13.4287 6.2431C13.5152 6.4107 13.5166 6.58638 13.4287 6.75678L12.3828 8.49995H15.5918L14.5683 6.75287C14.477 6.59683 14.477 6.40303 14.5683 6.24701L15.5918 4.49993H12.3828L13.4287 6.2431Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.25293 10.9668C7.40708 10.8793 7.59647 10.8801 7.75 10.9687C7.90356 11.0574 7.99869 11.2211 8 11.3984L8.01074 12.8388L9.30762 13.6054C9.42811 13.6994 9.49994 13.8448 9.5 14C9.5 14.1773 9.40587 14.3418 9.25293 14.4316L8.01074 15.1601L7.99512 16.667C7.97406 16.8184 7.88446 16.9536 7.75 17.0312C7.59642 17.1199 7.40713 17.1207 7.25293 17.0332L6 16.3203L4.74707 17.0332C4.59287 17.1207 4.40358 17.1199 4.25 17.0312C4.09643 16.9425 4.00124 16.7789 4 16.6015L3.99023 15.1601L2.74707 14.4316C2.59413 14.3418 2.5 14.1773 2.5 14C2.50006 13.8448 2.57188 13.6994 2.69238 13.6054L3.99023 12.8388L4 11.3984C4.00131 11.2211 4.09644 11.0574 4.25 10.9687C4.40353 10.8801 4.59292 10.8793 4.74707 10.9668L6 11.6787L7.25293 10.9668ZM4.99512 12.2568L5.75293 12.6884C5.90608 12.7754 6.09392 12.7754 6.24707 12.6884L7.00586 12.2568L7.01172 13.1308C7.01308 13.3068 7.10706 13.4695 7.25879 13.5586L8.01172 14L7.25879 14.4414C7.10706 14.5304 7.01315 14.6932 7.01172 14.8691L7.00586 15.7422L6.24707 15.3115C6.09397 15.2246 5.90603 15.2246 5.75293 15.3115L4.99512 15.7422L4.98828 14.8691C4.98703 14.7152 4.91459 14.5716 4.79492 14.4785L3.98926 14L4.74121 13.5586C4.87421 13.4805 4.96267 13.3457 4.9834 13.1953L4.99512 12.2568Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 11C15.6568 11 16.9999 12.3432 17 14C17 15.6568 15.6569 17 14 17C12.3431 17 11 15.6568 11 14C11.0001 12.3432 12.3432 11 14 11ZM12 14C12.0001 12.8955 12.8955 12 14 12C15.1045 12 15.9999 12.8955 16 14C16 15.1045 15.1046 16 14 16C12.8954 16 12 15.1045 12 14Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-300)]" style={{ flexShrink: 0 }}>
      <path d="M11.6318 4.01757C11.898 4.09032 12.055 4.36555 11.9824 4.63183L8.98242 15.6318C8.90966 15.8981 8.63449 16.0551 8.36816 15.9824C8.10193 15.9097 7.94495 15.6345 8.01758 15.3682L11.0176 4.36816C11.0904 4.102 11.3656 3.94497 11.6318 4.01757Z" />
      <path d="M13.124 6.17089C13.3059 5.96325 13.6213 5.9423 13.8291 6.12402L17.8291 9.62402L17.9014 9.70215C17.9647 9.78754 18 9.89182 18 10C18 10.1441 17.9375 10.281 17.8291 10.376L13.8291 13.876L13.7471 13.9346C13.5449 14.0498 13.2833 14.011 13.124 13.8291C12.9649 13.6472 12.9606 13.3824 13.1016 13.1973L13.1709 13.124L16.7412 10L13.1709 6.87597C12.9632 6.69411 12.9422 6.37866 13.124 6.17089Z" />
      <path d="M6.25293 6.06542C6.45509 5.95025 6.71675 5.98908 6.87598 6.17089C7.03513 6.35279 7.03933 6.6176 6.89844 6.80273L6.8291 6.87597L3.25879 10L6.8291 13.124C7.03682 13.3059 7.05771 13.6213 6.87598 13.8291C6.69413 14.0369 6.37869 14.0578 6.1709 13.876L2.1709 10.376L2.09863 10.2979C2.03528 10.2124 2 10.1082 2 10C2.00005 9.85591 2.06247 9.71893 2.1709 9.62402L6.1709 6.12402L6.25293 6.06542Z" />
    </svg>
  );
}

function KeysIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-brand)]" style={{ flexShrink: 0 }}>
      <path d="M13 2a5 5 0 0 1 1.28 9.84l-.28.06v1.6l-1.5 1.5v1.5L11 18H8.5v-2.5l4.02-4.02A5 5 0 0 1 13 2Zm0 1a4 4 0 0 0-.88 7.9l.38.1.5.06V12.41l-4 4.01V17h1.59l.91-.91V14.5l1.5-1.5v-1.94l.5-.06a4 4 0 0 0-.5-7.95Zm1 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 1a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z" />
    </svg>
  );
}
