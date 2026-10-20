"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  FolderGit2,
  ArrowLeft,
  Activity,
  ShieldAlert,
  FileCode,
  Bug,
  ShieldCheck,
  Clock,
  Play,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  GitPullRequest,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface FileItem {
  id: string;
  path: string;
  name: string;
  language: string;
  sizeBytes: number;
}

interface IssueItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  location: string;
  recommendation: string;
  status: string;
}

interface SecurityFindingItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: "static" | "potential" | "informational";
  cwe?: string;
  title: string;
  description: string;
  location: string;
  risk: string;
  remediation: string;
  status: string;
}

interface AnalysisItem {
  id: string;
  status: string;
  summary: string;
  codeQualityScore: number;
  securityScore: number;
  totalIssues: number;
  criticalIssues: number;
  durationMs: number;
  createdAt: string;
}

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  language: string;
  repositoryUrl: string;
  healthScore: number;
  securityScore: number;
  createdAt: string;
  updatedAt: string;
  files: FileItem[];
  issues: IssueItem[];
  securityFindings: SecurityFindingItem[];
  analyses: AnalysisItem[];
  counts: {
    files: number;
    issues: number;
    securityFindings: number;
    analyses: number;
  };
}

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"issues" | "security" | "files" | "history">("issues");

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load project details");
      setProject(data.project);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error fetching project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-2xl bg-slate-900 border border-white/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-slate-900 border border-white/5 animate-pulse" />
          <div className="h-24 rounded-xl bg-slate-900 border border-white/5 animate-pulse" />
          <div className="h-24 rounded-xl bg-slate-900 border border-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="p-8 text-center border-rose-500/30 bg-rose-950/20 space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-slate-400">{error || "Could not retrieve project from database."}</p>
        <Link href="/dashboard/projects">
          <Button size="sm" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & quick action */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Catalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={fetchProjectDetails}
          >
            Refresh
          </Button>
          <Link href="/dashboard/analyzer">
            <Button size="sm" variant="primary" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
              Scan Code
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Banner Card */}
      <Card className="p-6 border-white/10 bg-[#0a0f1d] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">{project.name}</h1>
              <Badge variant="neutral" size="sm">
                {project.language}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed pt-1">
              {project.description || "No project description provided."}
            </p>
          </div>

          {/* Quick gauges */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 rounded-xl bg-[#070b14] border border-white/5 text-center min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Health Score</span>
              <p
                className={`text-xl font-bold font-mono mt-0.5 ${
                  project.healthScore >= 90
                    ? "text-emerald-400"
                    : project.healthScore >= 80
                    ? "text-cyan-400"
                    : "text-amber-400"
                }`}
              >
                {project.healthScore}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070b14] border border-white/5 text-center min-w-[90px]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Security Score</span>
              <p
                className={`text-xl font-bold font-mono mt-0.5 ${
                  project.securityScore >= 90
                    ? "text-emerald-400"
                    : project.securityScore >= 80
                    ? "text-cyan-400"
                    : "text-rose-400"
                }`}
              >
                {project.securityScore}%
              </p>
            </div>
          </div>
        </div>

        {project.repositoryUrl && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Repository:</span>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                {project.repositoryUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <Link
              href="/dashboard/github"
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <GitPullRequest className="w-3 h-3 text-cyan-400" />
              <span>Inspect PRs & Commits</span>
            </Link>
          </div>
        )}
      </Card>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090e1a] border border-white/10 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("issues")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "issues"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          Code Issues ({project.issues.length})
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "security"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Security Findings ({project.securityFindings.length})
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "files"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          Indexed Files ({project.files.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "history"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          Analysis History ({project.analyses.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* ISSUES TAB */}
        {activeTab === "issues" && (
          <div className="space-y-3">
            {project.issues.length === 0 ? (
              <Card className="text-center py-12 border-dashed border-white/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">Zero Open Issues</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Clean codebase! No bugs or smells detected in this project.
                </p>
              </Card>
            ) : (
              project.issues.map((issue) => (
                <Card
                  key={issue.id}
                  className="p-4 border-white/10 bg-[#0c1220] hover:border-amber-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge severity={issue.severity}>{issue.severity.toUpperCase()}</Badge>
                      <Badge variant="neutral">{issue.category}</Badge>
                      <h4 className="text-xs font-semibold text-white">{issue.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Status: {issue.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    {issue.location}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-emerald-300 font-mono">
                    <span className="text-slate-500">Fix Recommendation: </span>
                    {issue.recommendation}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* SECURITY FINDINGS TAB */}
        {activeTab === "security" && (
          <div className="space-y-3">
            {project.securityFindings.length === 0 ? (
              <Card className="text-center py-12 border-dashed border-white/10">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">No Vulnerabilities Detected</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  All static AST security checks passed with 100% compliance.
                </p>
              </Card>
            ) : (
              project.securityFindings.map((finding) => (
                <Card
                  key={finding.id}
                  className="p-4 border-rose-500/20 bg-[#0e111d] hover:border-rose-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge severity={finding.severity}>{finding.severity.toUpperCase()}</Badge>
                      {finding.cwe && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {finding.cwe}
                        </span>
                      )}
                      <h4 className="text-xs font-semibold text-white">{finding.title}</h4>
                    </div>
                    <Badge variant="error" size="sm">
                      {finding.category.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 font-mono">{finding.location}</p>

                  <p className="text-xs text-slate-300 leading-relaxed">{finding.description}</p>

                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300">
                    <strong className="block mb-0.5 text-rose-200">Risk Assessment:</strong>
                    {finding.risk}
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                    <strong className="block mb-0.5 text-emerald-200">Remediation:</strong>
                    {finding.remediation}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* FILES TAB */}
        {activeTab === "files" && (
          <Card className="p-4 border-white/10 bg-[#0a0f1d]">
            {project.files.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                No source files indexed for this project yet.
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                {project.files.map((file) => (
                  <div
                    key={file.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-200">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                      <span className="uppercase">{file.language}</span>
                      <span>•</span>
                      <span>{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ANALYSIS HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {project.analyses.length === 0 ? (
              <Card className="text-center py-10 border-dashed border-white/10 text-xs text-slate-500">
                No past analysis runs recorded.
              </Card>
            ) : (
              project.analyses.map((run) => (
                <Card key={run.id} className="p-4 border-white/10 bg-[#0a0f1d] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-cyan-400 font-bold">{run.id.slice(-6).toUpperCase()}</span>
                      <Badge variant="success" size="sm">
                        {run.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-slate-500 font-mono">
                      {new Date(run.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{run.summary}</p>

                  <div className="pt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                    <span>Quality Score: {run.codeQualityScore}%</span>
                    <span>•</span>
                    <span>Security Score: {run.securityScore}%</span>
                    <span>•</span>
                    <span>Duration: {(run.durationMs / 1000).toFixed(2)}s</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
