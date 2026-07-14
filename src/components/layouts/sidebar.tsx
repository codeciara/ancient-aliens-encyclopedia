"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tv,
  BookOpen,
  MapPin,
  Users,
  Lightbulb,
  Gem,
  Building2,
  Flame,
  ScrollText,
  Clock,
  Library,
  Tag,
  BookMarked,
  Search,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { type: "divider" as const, label: "Content" },
  { name: "Episodes", href: "/episodes", icon: Tv },
  { name: "Encyclopedia", href: "/encyclopedia", icon: BookOpen },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "People", href: "/people", icon: Users },
  { name: "Theories", href: "/theories", icon: Lightbulb },
  { name: "Artifacts", href: "/artifacts", icon: Gem },
  { name: "Civilizations", href: "/civilizations", icon: Building2 },
  { name: "Deities", href: "/deities", icon: Flame },
  { name: "Ancient Texts", href: "/texts", icon: ScrollText },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { type: "divider" as const, label: "Reference" },
  { name: "Sources", href: "/sources", icon: Library },
  { name: "Tags", href: "/tags", icon: Tag },
  { type: "divider" as const, label: "Publishing" },
  { name: "Book Builder", href: "/book-builder", icon: BookMarked },
  { name: "Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-deep-blue text-parchment flex flex-col z-40">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <h1 className="font-display text-lg text-gold-light leading-tight">
          Ancient Aliens
        </h1>
        <p className="text-xs text-parchment/60 mt-0.5">Encyclopedia</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navigation.map((item, i) => {
            if ("type" in item && item.type === "divider") {
              return (
                <li key={i} className="pt-4 pb-1 px-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-parchment/40">
                    {item.label}
                  </span>
                </li>
              );
            }

            if (!("href" in item)) return null;

            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                    ${isActive
                      ? "bg-gold/20 text-gold-light font-medium"
                      : "text-parchment/70 hover:bg-white/5 hover:text-parchment"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10 text-xs text-parchment/40">
        v0.1.0 &middot; Phase 1
      </div>
    </aside>
  );
}
