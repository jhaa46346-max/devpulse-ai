import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Developer Intelligence & Security Platform</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            <span className="text-slate-400">v0.1.0 Foundation</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Understand. Secure. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Improve. Ship.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            DevPulse AI combines semantic code comprehension, static AST vulnerability detection,
            and an intelligent assistant to safeguard and optimize your entire codebase.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" icon={<Play className="w-4 h-4 fill-current" />}>
                Launch DevPulse Console
              </Button>
            </Link>
            <Link href="/dashboard/analyzer">
              <Button size="lg" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                Try Code Analyzer
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              OWASP Top 10 Auditing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Static AST Analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Structured AI Reasoning
            </span>
          </div>
        </div>

        {/* Interactive Dashboard Mockup Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0a0f1e]/90 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl overflow-hidden">
          {/* Mock Window Title Bar */}
          <div className="h-10 px-4 border-b border-white/10 bg-[#080d19] flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-300 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                devpulse-intelligence-engine // analysis-session-042
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-500">Engine: Dual AST + AI</span>
              <Badge variant="success" size="sm" dot>
                Online
              </Badge>
            </div>
          </div>

          {/* Window Body: Two-column live simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Left: Code Viewer Panel */}
            <div className="lg:col-span-6 p-4 sm:p-5 font-mono text-xs bg-[#070b14]/70 overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[11px] text-slate-400">
                <span className="text-cyan-400 font-semibold">src/api/auth/login.ts</span>
                <span className="text-slate-500">TypeScript • 24 lines</span>
              </div>
              <div className="space-y-1 text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-600 select-none mr-3">01</span>
                  <span className="text-purple-400">export async function</span>{" "}
                  <span className="text-blue-400">handleLogin</span>(req: Request) &#123;
                </div>
                <div>
                  <span className="text-slate-600 select-none mr-3">02</span>
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> &#123; username, password &#125; ={" "}
                  <span className="text-purple-400">await</span> req.json();
                </div>
                <div>
                  <span className="text-slate-600 select-none mr-3">03</span>
                  &nbsp;&nbsp;
                </div>
                <div className="bg-rose-950/40 border-l-2 border-rose-500 pl-1 -ml-1 text-rose-200">
                  <span className="text-rose-400 select-none mr-3">04</span>
                  &nbsp;&nbsp;<span className="text-slate-500">// VULNERABLE: Direct string interpolation</span>
                </div>
                <div className="bg-rose-950/40 border-l-2 border-rose-500 pl-1 -ml-1 text-rose-200">
                  <span className="text-rose-400 select-none mr-3">05</span>
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> query ={" "}
                  <span className="text-emerald-300">`SELECT * FROM users WHERE user = '$&#123;username&#125;'`</span>;
                </div>
                <div>
                  <span className="text-slate-600 select-none mr-3">06</span>
                  &nbsp;&nbsp;<span className="text-purple-400">const</span> user ={" "}
                  <span className="text-purple-400">await</span> db.rawQuery(query);
                </div>
                <div>
                  <span className="text-slate-600 select-none mr-3">07</span>
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> Response.json(user);
                </div>
                <div>
                  <span className="text-slate-600 select-none mr-3">08</span>
                  &#125;
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Scanner: Semgrep AST + GPT-4o Engine</span>
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  1 Critical Finding Detected
                </span>
              </div>
            </div>

            {/* Right: AI Intelligence Panel */}
            <div className="lg:col-span-6 p-4 sm:p-5 bg-[#0a0f1d] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white">DevPulse Security Finding</span>
                  </div>
                  <Badge severity="critical">CRITICAL • CWE-89</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-200">
                      SQL Injection via Unsanitized Input
                    </h4>
                    <p className="mt-1 text-slate-400 text-[11px] leading-normal">
                      User-supplied parameter <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">username</code> is concatenated directly into SQL string without parameterization.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        AI Remediation Suggestion
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">1-Click Fix</span>
                    </div>
                    <pre className="font-mono text-[10px] text-emerald-200 overflow-x-auto p-2 rounded bg-black/40">
                      <code>{`// Parameterized Query:
const user = await db.query(
  'SELECT * FROM users WHERE user = $1',
  [username]
);`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Health Score Impact Metric */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Health Impact:</span>
                <span className="font-mono font-bold text-rose-400">-15 pts (Security Threat)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
