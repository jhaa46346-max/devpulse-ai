import React from "react";
import {
  Code2,
  Bug,
  ShieldCheck,
  Zap,
  FileText,
  Activity,
  Bot,
  TestTube2,
} from "lucide-react";
import { Card } from "../ui/Card";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Code2,
      title: "Deep Code Understanding",
      description:
        "Analyzes semantic relationships, class hierarchies, dependency flow, and complex logic patterns across languages.",
      accent: "cyan" as const,
    },
    {
      icon: Bug,
      title: "Intelligent Bug Detection",
      description:
        "Flags latent runtime exceptions, race conditions, edge-case unhandled states, and subtle syntax pitfalls before production.",
      accent: "amber" as const,
    },
    {
      icon: ShieldCheck,
      title: "Cybersecurity & SAST",
      description:
        "Comprehensive scanning for SQLi, XSS, SSRF, path traversal, hardcoded secrets, and OWASP Top 10 vulnerabilities.",
      accent: "rose" as const,
    },
    {
      icon: Zap,
      title: "Automated Code Optimization",
      description:
        "Provides concrete refactoring diffs, complexity reductions, and performance tweaks tailored to modern language standards.",
      accent: "emerald" as const,
    },
    {
      icon: FileText,
      title: "Doc & Specification Generator",
      description:
        "Auto-generates clean JSDoc/docstrings, OpenAPI/Swagger specifications, and architecture summaries directly from code.",
      accent: "cyan" as const,
    },
    {
      icon: TestTube2,
      title: "Automated Test Generation",
      description:
        "Synthesizes high-coverage unit tests, boundary conditions, and mock fixtures for Jest, Pytest, and Go testing suites.",
      accent: "violet" as const,
    },
    {
      icon: Activity,
      title: "Holistic Health Score",
      description:
        "Real-time composite scoring evaluating code smell density, security vulnerability debt, maintainability, and test coverage.",
      accent: "emerald" as const,
    },
    {
      icon: Bot,
      title: "Project-Aware AI Assistant",
      description:
        "Converse directly with an AI engineer that retains deep contextual memory of your files, symbols, and architecture.",
      accent: "cyan" as const,
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-white/5 bg-[#090e1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            Comprehensive Platform
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Developer Intelligence at Every Layer
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            From single-file reviews to multi-service enterprise architectures, DevPulse AI delivers
            the precision tools modern engineering teams demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                interactive
                glow={feature.accent === "rose" ? "rose" : feature.accent === "emerald" ? "emerald" : "cyan"}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[11px] font-mono text-cyan-400/80">
                  <span>Engineered for Production →</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
