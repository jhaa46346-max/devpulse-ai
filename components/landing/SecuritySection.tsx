import React from "react";
import {
  ShieldAlert,
  Lock,
  FileCode2,
  CheckCircle,
  EyeOff,
  ServerOff,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      icon: EyeOff,
      title: "Zero Secret Exposure",
      description:
        "All credentials, environment variables, and authentication tokens are managed strictly on server boundaries and never logged or leaked.",
    },
    {
      icon: ServerOff,
      title: "No Server-Side Code Execution",
      description:
        "All uploaded source code is parsed as inert text and AST representations. No user scripts or binaries are executed on host servers.",
    },
    {
      icon: Lock,
      title: "Sandboxed AST Parsing",
      description:
        "Static analysis operates within strict memory and CPU isolation bounds, defending the platform against malformed file payloads.",
    },
    {
      icon: CheckCircle,
      title: "Triaged Finding Confidence",
      description:
        "Every vulnerability is tagged as Confirmed Static, Potential Pattern, or Informational, minimizing false-alarm fatigue.",
    },
  ];

  const vulnerabilityCoverage = [
    "CWE-89: SQL Injection",
    "CWE-79: Cross-Site Scripting (XSS)",
    "CWE-78: OS Command Injection",
    "CWE-798: Hardcoded Credentials",
    "CWE-22: Path Traversal",
    "CWE-918: Server-Side Request Forgery",
    "CWE-502: Deserialization of Untrusted Data",
    "CWE-327: Broken / Weak Cryptography",
    "CWE-20: Missing Input Validation",
    "CWE-306: Missing Authentication Check",
  ];

  return (
    <section id="security" className="py-20 bg-[#06090f] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs font-mono mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cybersecurity First Architecture</span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security You Can Trust With Your Code
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Engineered under zero-trust assumptions. We prioritize defensive posture, static rule
            rigor, and cryptographic integrity.
          </p>
        </div>

        {/* Security Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-5 border-white/10 bg-[#0b101c]">
                <div className="w-9 h-9 rounded-lg bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Vulnerability Matrix Overview */}
        <div className="rounded-2xl border border-white/10 bg-[#090d18] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-cyan-400" />
                Continuous Vulnerability & CWE Detection Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Semgrep-compatible AST rule mapping targeting OWASP Top 10 and CWE enterprise checklists.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="error" size="sm" dot>
                Static Findings
              </Badge>
              <Badge variant="warning" size="sm">
                Potential
              </Badge>
              <Badge variant="info" size="sm">
                Informational
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {vulnerabilityCoverage.map((item) => (
              <div
                key={item}
                className="p-2.5 rounded-lg border border-white/5 bg-[#0e1627] text-xs font-mono text-slate-300 flex items-center gap-2 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
