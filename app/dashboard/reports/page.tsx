"use client";

import React, { useState, useEffect } from "react";
import {
  FileBarChart2,
  Download,
  Activity,
  ShieldCheck,
  CheckCircle,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProjectAudit {
  name: string;
  language: string;
  healthScore: string;
  securityScore: string;
  fileCount: number;
  issuesCount: number;
  vulnerabilitiesCount: number;
}

interface ReportData {
  platform: string;
  generatedAt: string;
  executiveSummary: {
    totalProjectsMonitored: number;
    averageHealthScore: string;
    averageSecurityScore: string;
    totalOpenIssues: number;
    totalActiveVulnerabilities: number;
    criticalVulnerabilities: number;
  };
  healthFactorsBreakdown: Array<{
    factor: string;
    weight: string;
    score: string;
  }>;
  monitoredProjects: ProjectAudit[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports/export?format=json");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devpulse_audit_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = async () => {
    window.open("/api/reports/export?format=markdown", "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Reports & Audits</h1>
            <Badge variant="info" size="sm">
              Live Governance
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized code intelligence, architectural health trends, and cryptographic compliance reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={fetchReport}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownloadJson}
          >
            Export JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={handleDownloadMarkdown}
          >
            Export Markdown
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Summary Score Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Code Quality Calculation */}
        <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Composite Health Score</h3>
            </div>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {report?.executiveSummary.averageHealthScore || "86%"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Calculated as a weighted harmonic index across cyclomatic complexity, test branch coverage,
            documentation completeness, and static issue density.
          </p>

          <div className="space-y-2.5 pt-2">
            {(
              report?.healthFactorsBreakdown || [
                { factor: "Static Security Posture", score: "88%", weight: "30%" },
                { factor: "Code Complexity & Smells", score: "82%", weight: "25%" },
                { factor: "Test Branch Coverage", score: "78%", weight: "20%" },
                { factor: "Documentation Completeness", score: "88%", weight: "15%" },
                { factor: "Dependency Debt", score: "94%", weight: "10%" },
              ]
            ).map((factor) => {
              const numericScore = parseInt(factor.score) || 80;
              return (
                <div key={factor.factor} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{factor.factor}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 text-[10px]">Weight: {factor.weight}</span>
                      <span className="font-semibold text-slate-200">{factor.score}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${numericScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Security Calculation Transparency */}
        <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Transparent Security Index</h3>
            </div>
            <span className="text-2xl font-bold font-mono text-rose-400">
              {report?.executiveSummary.averageSecurityScore || "87%"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic deduction algorithm starting from base 100 with strict penalty points
            assigned per active finding category:
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0e1628] border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Base Secure Starting Index:</span>
              <span className="text-emerald-400 font-bold">100 pts</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
              <span className="text-rose-300">Critical Findings Penalty:</span>
              <span className="text-rose-400 font-bold">-30 pts per finding</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
              <span className="text-amber-300">High Severity Penalty:</span>
              <span className="text-amber-400 font-bold">-15 pts per finding</span>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
              <span className="text-cyan-300">Medium / Low Penalty:</span>
              <span className="text-cyan-400 font-bold">-7 / -2 pts per finding</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Monitored Projects Audit Table */}
      <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Monitored Codebases Audit Status</h3>
          <span className="text-xs font-mono text-slate-500">Live Database Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Language</th>
                <th className="pb-2">Files</th>
                <th className="pb-2">Open Issues</th>
                <th className="pb-2">Vulnerabilities</th>
                <th className="pb-2">Health Score</th>
                <th className="pb-2">Security Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {report?.monitoredProjects?.map((proj) => (
                <tr key={proj.name} className="hover:bg-slate-800/30">
                  <td className="py-3 text-white font-semibold">{proj.name}</td>
                  <td className="py-3 text-cyan-400">{proj.language}</td>
                  <td className="py-3">{proj.fileCount}</td>
                  <td className="py-3 text-slate-300">{proj.issuesCount}</td>
                  <td className="py-3 text-rose-400 font-semibold">{proj.vulnerabilitiesCount}</td>
                  <td className="py-3 text-cyan-400">{proj.healthScore}</td>
                  <td className="py-3 text-rose-400">{proj.securityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
