import React from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight, GitBranch } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080c14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Terminal className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                DevPulse
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-semibold">
                AI
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-cyan-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            How It Works
          </Link>
          <Link href="#security" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Security Engine
          </Link>
          <Link href="#ai-capabilities" className="hover:text-cyan-400 transition-colors">
            AI Assistant
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Open Console
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
