import React from "react";
import { UploadCloud, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Ingest Codebase",
      description:
        "Input source code via raw snippet, upload archive files, or connect your repository. DevPulse parses the syntax tree safely without executing untrusted code.",
    },
    {
      step: "02",
      icon: Cpu,
      title: "Multi-Engine Deep Scan",
      description:
        "Parallel static AST rules (Semgrep-grade engine) flag hardcoded secrets and known CWE patterns, while AI reasoning models evaluate architecture, logic, and context.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Triage & Remediate",
      description:
        "Review classified findings (Confirmed vs Potential vs Informational). Apply ready-to-merge refactoring diffs or query the DevPulse AI Assistant for interactive debugging.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#080c14] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            Workflow Architecture
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DevPulse AI Operates
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Engineered for high-assurance environments: zero execution of untrusted code, deterministic
            static analysis, and structured AI evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative rounded-2xl border border-white/10 bg-[#0c1220] p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <span>Phase {idx + 1} Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
