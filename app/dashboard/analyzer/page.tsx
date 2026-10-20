"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Play,
  FileText,
  Bug,
  Zap,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Upload,
  FolderGit2,
  AlertCircle,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AnalysisOutput {
  summary: string;
  explanation: {
    overview: string;
    functions: Array<{ name: string; description: string; signature?: string }>;
    dataFlow: string;
    dependencies: string[];
  };
  bugs: Array<{
    severity: "critical" | "high" | "medium" | "low" | "info";
    title: string;
    description: string;
    location: string;
    recommendation: string;
  }>;
  improvements: Array<{
    category: "performance" | "readability" | "maintainability" | "refactor";
    title: string;
    description: string;
    diffSnippet?: string;
  }>;
  securityFindings: Array<{
    severity: "critical" | "high" | "medium" | "low" | "info";
    category: string;
    cwe: string;
    title: string;
    description: string;
    location: string;
    risk: string;
    remediation: string;
  }>;
  documentation: {
    jsdoc: string;
    readmeSection: string;
  };
  generatedTests: {
    framework: string;
    code: string;
  };
  codeQualityScore: number;
  securityScore: number;
  analysisId?: string;
}

export default function AnalyzerPage() {
  const [language, setLanguage] = useState("typescript");
  const [fileName, setFileName] = useState("auth_service.ts");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectsList, setProjectsList] = useState<Array<{ id: string; name: string }>>([]);
  const [activeTab, setActiveTab] = useState<"bugs" | "security" | "improvements" | "explanation" | "docs">("bugs");

  const sampleSnippets: Record<string, { name: string; code: string }> = {
    typescript: {
      name: "auth_service.ts",
      code: `// Sample: Authentication Handler with SQL Injection & Missing Error Handling
export async function authenticateUser(req: Request) {
  const { email, password } = await req.json();

  // Insecure string concatenation:
  const query = "SELECT * FROM accounts WHERE email = '" + email + "' AND password = '" + password + "'";
  const user = await db.query(query);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Memory risk: missing token expiry
  const sessionToken = signToken({ id: user.id });
  return Response.json({ token: sessionToken, user });
}`,
    },
    python: {
      name: "session_loader.py",
      code: `# Sample: Insecure File Traversal & Deprecated Hash
import hashlib
import os

def load_user_report(user_filename):
    # Weak cryptographic hash:
    token = hashlib.md5(user_filename.encode()).hexdigest()
    
    # Path traversal vulnerability:
    target_path = os.path.join("/var/data/reports", user_filename)
    with open(target_path, "r") as f:
        return f.read(), token`,
    },
    go: {
      name: "payment_worker.go",
      code: `package main

import (
    "sync"
)

// Insecure hardcoded API secret key
const StripeLiveSecret = "sk_test_fake_sample_mock_api_secret_key_123"

type TransactionPool struct {
    total int
}

func (p *TransactionPool) Process(wg *sync.WaitGroup) {
    defer wg.Done()
    // Concurrency race condition: unsynchronized access
    p.total++
}`,
    },
  };

  const [code, setCode] = useState(sampleSnippets.typescript.code);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Load projects list
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.projects.length > 0) {
            setProjectsList(data.projects);
            setSelectedProjectId(data.projects[0].id);
          }
        }
      } catch {
        // Ignore in offline mode
      }
    }
    loadProjects();
  }, []);

  const handleRunSample = (lang: string) => {
    setLanguage(lang);
    setFileName(sampleSnippets[lang].name);
    setCode(sampleSnippets[lang].code);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "py") setLanguage("python");
    else if (ext === "go") setLanguage("go");
    else if (ext === "rs") setLanguage("rust");
    else setLanguage("typescript");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCode(text);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please paste or upload code to analyze.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      const res = await fetch("/api/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          language,
          fileName,
          projectId: selectedProjectId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed.");

      setAnalysisResult(data.data);
      // Auto-switch to most critical tab
      if (data.data.securityFindings.length > 0) setActiveTab("security");
      else if (data.data.bugs.length > 0) setActiveTab("bugs");
      else setActiveTab("explanation");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error analyzing code.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Code Intelligence Workbench</h1>
            <Badge variant="info" size="sm" dot>
              Multi-Engine SAST + AI
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Static AST vulnerability scanning, logical bug auditing, automated refactoring, and test synthesis.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c1220] hover:bg-slate-800 text-xs text-slate-300 transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setCode("");
              setAnalysisResult(null);
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={handleAnalyze}
            disabled={isAnalyzing || !code.trim()}
          >
            {isAnalyzing ? "Analyzing AST & Reasoning..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Results Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Input Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-t-xl bg-[#090e1a] border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-transparent border-none text-white font-mono text-xs outline-none w-36"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[11px]">Sample:</span>
              <button
                onClick={() => handleRunSample("typescript")}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  language === "typescript"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                TS (SQLi)
              </button>
              <button
                onClick={() => handleRunSample("python")}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  language === "python"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Py (Traversal)
              </button>
              <button
                onClick={() => handleRunSample("go")}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  language === "go"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Go (Secret)
              </button>
            </div>
          </div>

          <div className="relative rounded-b-xl border border-t-0 border-white/10 bg-[#070b14] overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code snippet or function here..."
              rows={18}
              className="w-full bg-transparent p-4 font-mono text-xs text-slate-200 outline-none resize-none leading-relaxed selection:bg-cyan-500/30"
              spellCheck={false}
            />
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500 bg-[#070b14]/80 px-2 py-0.5 rounded">
              {code.split("\n").length} lines • {code.length} characters
            </div>
          </div>

          {/* Project Linker */}
          <div className="p-3 rounded-lg border border-white/5 bg-[#090e1b] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 font-mono text-[11px]">Save Findings to Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-2 py-1 rounded bg-[#070b14] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
              >
                <option value="">None (Standalone Run)</option>
                {projectsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Badge variant="success" size="sm">
              AST Sandbox Safe
            </Badge>
          </div>
        </div>

        {/* Right: Structured Output Tabs (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Output Nav Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090e1a] border border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "security"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Security ({analysisResult?.securityFindings.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("bugs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "bugs"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              Bugs ({analysisResult?.bugs.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("improvements")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "improvements"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Refactor ({analysisResult?.improvements.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "explanation"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Explanation
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "docs"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Docs & Tests
            </button>
          </div>

          {/* Scores Header if analysis completed */}
          {analysisResult && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-white/10 bg-[#090e1a]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> Code Quality
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {analysisResult.codeQualityScore}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Security Score
                </span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {analysisResult.securityScore}%
                </span>
              </div>
            </div>
          )}

          {/* Tab Content Panes */}
          <div className="rounded-xl border border-white/10 bg-[#0a0f1d] p-4 min-h-[420px] max-h-[540px] overflow-y-auto space-y-4">
            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-24 text-slate-500 space-y-2">
                <Code2 className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">Ready for Analysis</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click &apos;Run Analysis&apos; to trigger AST vulnerability checks, logical bug audits, and code optimization diffs.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-24 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-semibold text-white">Running Multi-Engine Code Scan...</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Evaluating Semgrep rulesets & synthesizing neural code reasoning...
                </p>
              </div>
            )}

            {/* SECURITY FINDINGS TAB */}
            {analysisResult && activeTab === "security" && (
              <div className="space-y-3">
                {analysisResult.securityFindings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-white font-semibold">Zero Security Vulnerabilities</p>
                    <p className="text-[11px] text-slate-400">All static AST security checks passed cleanly.</p>
                  </div>
                ) : (
                  analysisResult.securityFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-950/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Badge severity={finding.severity}>{finding.severity.toUpperCase()}</Badge>
                          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {finding.cwe}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{finding.location}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white">{finding.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{finding.description}</p>

                      <div className="p-2.5 rounded bg-black/40 font-mono text-[11px] text-rose-300">
                        <strong className="text-rose-400">Risk: </strong>
                        {finding.risk}
                      </div>

                      <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20 font-mono text-[11px] text-emerald-300">
                        <strong className="text-emerald-400">Remediation: </strong>
                        {finding.remediation}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BUGS TAB */}
            {analysisResult && activeTab === "bugs" && (
              <div className="space-y-3">
                {analysisResult.bugs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-white font-semibold">No Logic Bugs Detected</p>
                    <p className="text-[11px] text-slate-400">No runtime exception risks or syntax smells found.</p>
                  </div>
                ) : (
                  analysisResult.bugs.map((bug, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge severity={bug.severity}>{bug.severity.toUpperCase()}</Badge>
                        <span className="text-[10px] font-mono text-slate-500">{bug.location}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{bug.title}</h4>
                      <p className="text-xs text-slate-300">{bug.description}</p>
                      <p className="text-[11px] font-mono text-emerald-300 pt-1">
                        Recommendation: {bug.recommendation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* IMPROVEMENTS TAB */}
            {analysisResult && activeTab === "improvements" && (
              <div className="space-y-3">
                {analysisResult.improvements.map((imp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-white/5 bg-[#0e1628] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{imp.title}</span>
                      <Badge variant="info">{imp.category.toUpperCase()}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{imp.description}</p>
                    {imp.diffSnippet && (
                      <pre className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                        <code>{imp.diffSnippet}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EXPLANATION TAB */}
            {analysisResult && activeTab === "explanation" && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-lg bg-[#0e1628] border border-white/5 space-y-1">
                  <h4 className="font-bold text-white font-sans">Module Summary</h4>
                  <p className="text-slate-300 font-sans">{analysisResult.explanation.overview}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0e1628] border border-white/5 space-y-2">
                  <h4 className="font-bold text-white font-sans">Data Flow Pipeline</h4>
                  <p className="font-mono text-[11px] text-cyan-300 bg-black/40 p-2.5 rounded border border-white/5">
                    {analysisResult.explanation.dataFlow}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white font-sans">Discovered Functions & Symbols</h4>
                  {analysisResult.explanation.functions.map((func, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#070b14] border border-white/5 font-mono">
                      <span className="text-cyan-400 font-bold">{func.signature || func.name}</span>
                      <p className="text-[11px] text-slate-400 mt-1">{func.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOCS & TESTS TAB */}
            {analysisResult && activeTab === "docs" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-[#0e1628] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Generated Documentation</span>
                    <button
                      onClick={() => handleCopy(analysisResult.documentation.jsdoc, "jsdoc")}
                      className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedType === "jsdoc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedType === "jsdoc" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-black/60 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>{analysisResult.documentation.jsdoc}</code>
                  </pre>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0e1628] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Generated Unit Tests ({analysisResult.generatedTests.framework.toUpperCase()})
                    </span>
                    <button
                      onClick={() => handleCopy(analysisResult.generatedTests.code, "tests")}
                      className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedType === "tests" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedType === "tests" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-black/60 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    <code>{analysisResult.generatedTests.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
