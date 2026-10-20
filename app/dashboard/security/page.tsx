"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileCode,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  FolderGit2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SecurityFinding {
  id: string;
  projectId: string;
  projectName: string;
  language: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: "static" | "potential" | "informational";
  cwe?: string;
  title: string;
  description: string;
  location: string;
  risk: string;
  remediation: string;
  status: string;
  createdAt: string;
}

export default function SecurityPage() {
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [securityScore, setSecurityScore] = useState(100);
  const [counts, setCounts] = useState({ critical: 0, high: 0, medium: 0, low: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const fetchSecurityFindings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/security/scan");
      const data = await res.json();
      if (data.success) {
        setFindings(data.data.findings);
        setSecurityScore(data.data.score);
        setCounts(data.data.counts);
        if (data.data.findings.length > 0 && !expandedId) {
          setExpandedId(data.data.findings[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading security findings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityFindings();
  }, []);

  const handleRunAudit = async () => {
    try {
      setAuditRunning(true);
      setAuditNotice(null);
      // Run audit across first project in database
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (projData.success && projData.projects.length > 0) {
        const targetId = projData.projects[0].id;
        const res = await fetch("/api/security/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: targetId }),
        });
        const data = await res.json();
        if (data.success) {
          setAuditNotice(data.message || "Audit completed.");
          fetchSecurityFindings();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuditRunning(false);
    }
  };

  const filtered = findings.filter((f) => {
    if (filterSeverity === "all") return true;
    return f.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security & Vulnerability Hub</h1>
            <Badge variant="error" size="sm" dot>
              {counts.total} Active Findings
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Static AST rule validation and dynamic vulnerability triage across all connected repositories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={fetchSecurityFindings}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={handleRunAudit}
            disabled={auditRunning}
          >
            {auditRunning ? "Scanning AST..." : "Run Security Audit"}
          </Button>
        </div>
      </div>

      {auditNotice && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{auditNotice}</span>
        </div>
      )}

      {/* Security Health Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-rose-500/20 bg-[#0d101c] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 font-mono font-bold text-lg">
            {securityScore}%
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Security Score</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Base 100 - Severity Penalty</p>
          </div>
        </Card>

        <Card className="p-4 border-white/5 bg-[#0a0f1d] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Critical ({counts.critical})</p>
            <p className="text-xl font-bold text-rose-400 font-mono mt-1">
              -{counts.critical * 30} pts
            </p>
          </div>
          <Badge severity="critical">P0</Badge>
        </Card>

        <Card className="p-4 border-white/5 bg-[#0a0f1d] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">High ({counts.high})</p>
            <p className="text-xl font-bold text-amber-400 font-mono mt-1">
              -{counts.high * 15} pts
            </p>
          </div>
          <Badge severity="high">P1</Badge>
        </Card>

        <Card className="p-4 border-white/5 bg-[#0a0f1d] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Med / Low ({counts.medium + counts.low})</p>
            <p className="text-xl font-bold text-cyan-400 font-mono mt-1">
              -{counts.medium * 7 + counts.low * 2} pts
            </p>
          </div>
          <Badge severity="medium">P2/P3</Badge>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0a0f1e]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Filter Severity:</span>
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                filterSeverity === sev
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Triaged: {counts.total} Findings Active</span>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-xl bg-slate-900 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-white/10">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Security Vulnerabilities</h3>
            <p className="text-xs text-slate-400 mt-1">
              {filterSeverity !== "all"
                ? `No findings matching severity '${filterSeverity}'.`
                : "All static AST checks passed cleanly across all monitored repositories."}
            </p>
          </Card>
        ) : (
          filtered.map((finding) => {
            const isExpanded = expandedId === finding.id;
            return (
              <Card
                key={finding.id}
                className={`p-4 border transition-all ${
                  finding.severity === "critical"
                    ? "border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50"
                    : "border-white/10 bg-[#0a0f1d] hover:border-cyan-500/30"
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge severity={finding.severity}>{finding.severity.toUpperCase()}</Badge>
                      {finding.cwe && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {finding.cwe}
                        </span>
                      )}
                      <Badge
                        variant={
                          finding.category === "static"
                            ? "error"
                            : finding.category === "potential"
                            ? "warning"
                            : "info"
                        }
                      >
                        {finding.category === "static"
                          ? "Confirmed Static AST"
                          : finding.category === "potential"
                          ? "Potential Heuristic"
                          : "Informational"}
                      </Badge>
                      <h3 className="text-sm font-semibold text-white">{finding.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 font-mono">
                      <span className="text-cyan-400">{finding.projectName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-slate-500" />
                        {finding.location}
                      </span>
                    </div>
                  </div>

                  <button className="p-1 rounded text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-300">Technical Details:</h4>
                      <p className="mt-1 text-slate-400 leading-relaxed">{finding.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rose-300">Risk Assessment:</h4>
                      <p className="mt-1 text-slate-400 leading-relaxed">{finding.risk}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20">
                      <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Remediation Plan
                      </h4>
                      <p className="mt-1 text-emerald-200/90 leading-relaxed font-mono text-[11px]">
                        {finding.remediation}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
