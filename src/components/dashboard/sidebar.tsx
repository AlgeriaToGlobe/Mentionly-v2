"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Discover", href: "/dashboard/discover", icon: Search },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-30",
        className
      )}
    >
      <div className="px-6 py-5">
        <Link href="/" className="font-heading text-xl font-bold text-gray-900">
          Mentionly
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
            D
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Demo User</p>
            <p className="text-gray-400 text-xs">demo@mentionly.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
