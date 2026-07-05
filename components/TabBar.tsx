"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#1A1917" : "#B4AFA6";
  const sw = active ? 2.4 : 2;
  const common = {
    width: 22,
    height: 22,
    fill: "none",
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "home": // camera
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      );
    case "find":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default: // you
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

const TABS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/find", icon: "find", label: "Find" },
  { href: "/post", icon: "post", label: "Post" },
  { href: "/inbox", icon: "inbox", label: "Inbox" },
  { href: "/you", icon: "you", label: "You" },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 h-[66px] shrink-0 border-t border-line bg-paper flex items-stretch pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        if (tab.icon === "post") {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label="Post a job"
              className="flex-1 flex items-center justify-center"
            >
              <span className="w-[42px] h-[42px] rounded-full bg-accent flex items-center justify-center text-white text-2xl leading-none pb-0.5">
                +
              </span>
            </Link>
          );
        }
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-[3px]"
          >
            <Icon name={tab.icon} active={active} />
            <span
              className={`font-sans text-[10.5px] font-semibold ${
                active ? "text-ink" : "text-faint"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
