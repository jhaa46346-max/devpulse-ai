"use client";

import React, { useState } from "react";
import {
  Settings,
  Key,
  Shield,
  Bell,
  Cpu,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [activeEngine, setActiveEngine] = useState("gpt-4o");
  const [autoScanOnSave, setAutoScanOnSave] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <Badge variant="success" size="sm">
            Configured
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure security scanner thresholds, AI reasoning models, and local execution parameters.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Settings updated in local state successfully.
        </div>
      )}

      {/* Form sections */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            Workspace & Organization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                defaultValue="Default Engineering Workspace"
                className="w-full px-3 py-2 rounded-lg bg-[#0e1628] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Default Primary Language
              </label>
              <select
                defaultValue="typescript"
                className="w-full px-3 py-2 rounded-lg bg-[#0e1628] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              >
                <option value="typescript">TypeScript / JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
          </div>
        </Card>

        {/* AI Engine & API Keys */}
        <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Intelligence Engine
            </h3>
            <Badge variant="purple" size="sm">
              OpenAI
            </Badge>
          </div>

          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-950/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              API keys are never stored on client devices. In Phase 4, credentials are read safely
              from server-side <code className="font-mono text-cyan-300">.env</code> variables.
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Selected Reasoning Model
              </label>
              <select
                value={activeEngine}
                onChange={(e) => setActiveEngine(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0e1628] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              >
                <option value="gpt-4o">GPT-4o (High-Precision Reasoning & Security Audit)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (High-Speed Linting & Refactoring)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                OpenAI API Key (Override for development)
              </label>
              <input
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2 rounded-lg bg-[#0e1628] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Security Scanner Rules */}
        <Card className="p-5 border-white/10 bg-[#0a0f1d] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            Static Analysis & Heuristics
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScanOnSave}
                onChange={(e) => setAutoScanOnSave(e.target.checked)}
                className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300">
                Trigger real-time AST check upon file upload or code insertion
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300">
                Enforce OWASP Top 10 blocking rules on code analysis
              </span>
            </label>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
