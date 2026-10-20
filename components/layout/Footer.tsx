import React from "react";
import Link from "next/link";
import { Terminal, Shield, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#06090f] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Terminal className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-base font-bold text-white">DevPulse AI</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand. Secure. Improve. Ship.
              <br />
              Enterprise-grade code intelligence & automated vulnerability mitigation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analyzer" className="hover:text-cyan-400 transition-colors">
                  Code Analyzer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/security" className="hover:text-cyan-400 transition-colors">
                  Vulnerability Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard/assistant" className="hover:text-cyan-400 transition-colors">
                  DevPulse AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="hover:text-cyan-400 transition-colors">
                  Quality & Health Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Security & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Zero Secret Retention
              </li>
              <li>Static AST Rule Engine</li>
              <li>OWASP Top 10 Coverage</li>
              <li>CWE Vulnerability Mapping</li>
              <li>Sandboxed Code Evaluation</li>
            </ul>
          </div>

          {/* Architecture / Version info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Built with Next.js, TypeScript, Tailwind CSS, Semgrep Static Rules, and OpenAI Intelligence.
            </p>
            <div className="p-3 rounded-lg border border-white/5 bg-[#0a0f1d] text-xs font-mono text-slate-400">
              <div>Version: 0.1.0-alpha</div>
              <div className="text-cyan-400/80">Phase 1: Foundation Shell</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevPulse AI. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered for mission-critical software teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
