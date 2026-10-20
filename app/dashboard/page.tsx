"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Bug,
  ShieldAlert,
  Activity,
  AlertTriangle,
  ArrowRight,
  Plus,
  Play,
  Clock,
  FileCode,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DashboardMetrics {
  totalProjects: number;
  totalIssues: number;
  totalVulnerabilities: number;
  criticalIssues: number;
  overallHealth: number;
  overallSecurity: number;
}

interface RecentProject {
  id: string;
  name: string;
  description: string;
  language: string;
  healthScore: number;
  securityScore: number;
  fileCount: number;
  issuesCount: number;
  vulnerabilitiesCount: number;
  updatedAt: string;
}

interface RecentAnalysis {
  id: string;
  projectId: string;
  project: string;
  language: string;
  status: string;
  findings: string;
  file: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  duration: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load dashboard data");
      setMetrics(json.data.metrics);
      setRecentProjects(json.data.recentProjects);
      setRecentAnalyses(json.data.recentAnalyses);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner with live DB badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">System Overview</h1>
            <Badge variant="success" size="sm" dot>
              Live Database Connected
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry aggregated directly from PostgreSQL / Prisma database models.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Refresh"}
          </Button>
          <Link href="/dashboard/projects">
            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Project
            </Button>
          </Link>
          <Link href="/dashboard/analyzer">
            <Button size="sm" variant="primary" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
              Run Code Analysis
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Database Error: {error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Projects"
          value={loading ? "..." : (metrics?.totalProjects ?? 0)}
          subtitle="Monitored in database"
          icon={<FolderGit2 className="w-5 h-5" />}
          trend={{ value: "Active", positive: true }}
          accentColor="cyan"
        />
        <MetricCard
          title="Open Code Issues"
          value={loading ? "..." : (metrics?.totalIssues ?? 0)}
          subtitle="Triaged by AST engine"
          icon={<Bug className="w-5 h-5" />}
          trend={{ value: "Live", positive: true }}
          accentColor="amber"
        />
        <MetricCard
          title="Security Vulnerabilities"
          value={loading ? "..." : (metrics?.totalVulnerabilities ?? 0)}
          subtitle={`${metrics?.criticalIssues ?? 0} critical findings`}
          icon={<ShieldAlert className="w-5 h-5" />}
          trend={{
            value: (metrics?.criticalIssues ?? 0) > 0 ? "Action Needed" : "Secure",
            positive: (metrics?.criticalIssues ?? 0) === 0,
          }}
          accentColor="rose"
        />
        <MetricCard
          title="Composite Health"
          value={loading ? "..." : `${metrics?.overallHealth ?? 100}%`}
          subtitle={`Security score: ${metrics?.overallSecurity ?? 100}%`}
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: "Real-time", positive: true }}
          accentColor="emerald"
        />
      </div>

      {/* Main Grid: Projects & AI Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Projects (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Recent Projects</h2>
              <span className="text-xs font-mono text-slate-500">
                ({recentProjects.length} active in database)
              </span>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-xl border border-white/5 bg-[#0a0f1d] animate-pulse"
                />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <Card className="text-center py-10 border-dashed border-white/10">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-semibold">No projects registered</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Create a project to start tracking code health.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Card
                  key={project.id}
                  interactive
                  className="p-4 border-white/5 bg-[#0a0f1d] hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                        >
                          {project.name}
                        </Link>
                        <Badge variant="neutral" size="sm">
                          {project.language}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{project.description}</p>
                    </div>

                    {/* Health score gauge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Health:</span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            project.healthScore >= 90
                              ? "text-emerald-400"
                              : project.healthScore >= 80
                              ? "text-cyan-400"
                              : "text-amber-400"
                          }`}
                        >
                          {project.healthScore}%
                        </span>
                      </div>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.healthScore >= 90
                              ? "bg-emerald-400"
                              : project.healthScore >= 80
                              ? "bg-cyan-400"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${project.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{project.fileCount} files</span>
                      <span>•</span>
                      <span className="text-slate-400">{project.issuesCount} issues</span>
                      <span>•</span>
                      <span
                        className={
                          project.vulnerabilitiesCount > 0 ? "text-rose-400" : "text-emerald-400"
                        }
                      >
                        {project.vulnerabilitiesCount} vulnerabilities
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent AI Analysis Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Recent AI Activity</h2>
              <Badge variant="purple" size="sm">
                Dual AST + AI
              </Badge>
            </div>
            <Link
              href="/dashboard/analyzer"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-4 border-white/10 bg-[#0a0f1d] divide-y divide-white/5 space-y-3">
            {loading ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded bg-slate-800/40 animate-pulse" />
                ))}
              </div>
            ) : recentAnalyses.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No analyses recorded yet. Run a code scan to populate activity.
              </div>
            ) : (
              recentAnalyses.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="text-cyan-400 font-semibold">{item.id.slice(-6).toUpperCase()}</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-slate-400 truncate max-w-[130px]">{item.project}</span>
                    </div>
                    <Badge severity={item.severity}>{item.severity.toUpperCase()}</Badge>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="font-mono text-slate-300 truncate">{item.file}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{item.findings}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Scan Duration: {item.duration}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))
            )}

            <div className="pt-3">
              <Link href="/dashboard/analyzer" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Code Analyzer
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
