"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  ShieldAlert,
  Bot,
  FileBarChart2,
  Settings,
  Terminal,
  Activity,
  ChevronRight,
  ExternalLink,
  X,
  GitPullRequest,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderGit2,
      badge: "12",
    },
    {
      name: "Code Analyzer",
      href: "/dashboard/analyzer",
      icon: Code2,
      badge: undefined,
    },
    {
      name: "Security",
      href: "/dashboard/security",
      icon: ShieldAlert,
      badge: "5",
      badgeColor: "rose",
    },
    {
      name: "AI Assistant",
      href: "/dashboard/assistant",
      icon: Bot,
      badge: "AI",
      badgeColor: "cyan",
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: FileBarChart2,
      badge: undefined,
    },
    {
      name: "GitHub Reviews",
      href: "/dashboard/github",
      icon: GitPullRequest,
      badge: "PR",
      badgeColor: "cyan",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0a0f1d] border-r border-white/10 flex flex-col shrink-0 select-none">
      {/* Brand & Mobile Close */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Terminal className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                DevPulse
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Dev Intelligence</p>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Workspace Quick Switcher Preview */}
      <div className="p-3 border-b border-white/5">
        <div className="p-2.5 rounded-lg bg-[#0e1628] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0">
              DP
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">Default Workspace</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">Local Standalone</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          Core Modules
        </div>
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all",
                isActive
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded border",
                    item.badgeColor === "rose"
                      ? "bg-rose-950/50 text-rose-400 border-rose-500/30"
                      : item.badgeColor === "cyan"
                      ? "bg-cyan-950/50 text-cyan-300 border-cyan-500/30"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Health & System Status */}
      <div className="p-3 border-t border-white/10 bg-[#080d19] space-y-2">
        <div className="p-2.5 rounded-lg border border-white/5 bg-[#0b1222]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Engine Health
            </span>
            <span className="font-mono text-emerald-400 font-semibold text-[11px]">100%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full animate-pulse" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Static: Ready</span>
            <span>AI: Ready</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between p-2 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
};
