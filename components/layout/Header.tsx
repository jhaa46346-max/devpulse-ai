"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Play,
  ShieldCheck,
  ChevronRight,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Ignore unauthenticated in shell
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard Overview";
    if (path.includes("/projects")) return "Projects & Repositories";
    if (path.includes("/analyzer")) return "Code Analyzer Workbench";
    if (path.includes("/security")) return "Security & Vulnerability Hub";
    if (path.includes("/assistant")) return "DevPulse AI Assistant";
    if (path.includes("/reports")) return "Quality & Security Reports";
    if (path.includes("/settings")) return "Workspace Settings";
    return "Dashboard";
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#080c14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">DevPulse</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-semibold">{getPageTitle(pathname)}</span>
        </div>
      </div>

      {/* Middle/Right Tools */}
      <div className="flex items-center gap-3">
        {/* Search Input Mockup */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c1220] text-xs text-slate-400 w-56 lg:w-72 focus-within:border-cyan-500/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search code, CVEs, issues..."
            className="bg-transparent border-none outline-none w-full text-xs text-slate-200 placeholder-slate-500"
            readOnly
          />
          <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </div>

        {/* Security Engine Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Shield: Active</span>
        </div>

        {/* Download Source Zip */}
        <a
          href="/api/download"
          download="devpulse-ai-source.zip"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
          title="Download complete project source code (.zip)"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Source .ZIP</span>
        </a>

        {/* Quick Action: New Analysis */}
        <Link href="/dashboard/analyzer">
          <Button
            size="sm"
            variant="primary"
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs"
          >
            <span className="hidden sm:inline">New Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </Button>
        </Link>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>

        {/* Profile Pill & Dropdown */}
        <div className="relative pl-2 border-l border-white/10">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden xl:block text-left pr-1">
              <p className="text-xs font-medium text-slate-200 leading-none truncate max-w-[120px]">
                {user?.name || "Developer"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[120px]">
                {user?.email || "Local Mode"}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden xl:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0e1628] shadow-2xl p-2 z-50 text-xs">
              <div className="p-2 border-b border-white/5 space-y-0.5">
                <p className="font-semibold text-white">{user?.name || "Developer Account"}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email || "authenticated"}</p>
                <div className="pt-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
                    Role: {user?.role || "developer"}
                  </span>
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <a
                  href="/api/download"
                  download="devpulse-ai-source.zip"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-mono"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Source .ZIP</span>
                </a>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Workspace Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
