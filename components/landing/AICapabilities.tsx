import React from "react";
import { Bot, Sparkles, MessageSquare, Terminal, Zap, Check } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export const AICapabilities: React.FC = () => {
  const queryExamples = [
    "Explain the authentication architecture in auth_service.ts",
    "Find the memory leak in the WebSocket connection pool",
    "Audit this SQL query for second-order injection risks",
    "Generate full Jest unit tests with mock DB adapters",
    "Refactor this 200-line controller into clean hexagonal layers",
    "Diagnose why the Docker container runs out of heap memory",
  ];

  return (
    <section id="ai-capabilities" className="py-20 bg-[#080c14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contextual Intelligence Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              An AI Assistant That Actually Understands Your Codebase
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generic LLMs lack codebase grounding. DevPulse AI embeds your file graph, symbol
              hierarchy, and security posture so every response is technically accurate and actionable.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Project-Scoped Context</h4>
                  <p className="text-xs text-slate-400">
                    Only relevant function signatures and dependencies are sent to the reasoning engine.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Strict JSON Schemas</h4>
                  <p className="text-xs text-slate-400">
                    Structured responses eliminate hallucinated code and format issues.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Chat Preview */}
          <div className="lg:col-span-7">
            <Card className="p-0 border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
              <div className="h-10 px-4 bg-[#080d19] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">DevPulse AI Assistant</span>
                </div>
                <Badge variant="info" size="sm">
                  Model: GPT-4o Reasoning
                </Badge>
              </div>

              <div className="p-5 space-y-4 font-mono text-xs">
                {/* User Message */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0">
                    DEV
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-white/5 text-slate-200">
                    Why is my JWT refresh handler vulnerable to replay attacks?
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] text-slate-950 font-bold shrink-0">
                    AI
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0e172a] border border-cyan-500/30 text-slate-300 space-y-2.5">
                    <p className="text-xs leading-relaxed">
                      In <code className="text-cyan-300">src/auth/refresh.ts:18</code>, the refresh token is verified without checking a revocation blacklist or rotating the nonce in Redis:
                    </p>
                    <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[11px] text-emerald-300">
                      <code>{`// Recommended Fix: Enforce token family revocation
await redis.setex(\`revoked:\${tokenId}\`, 86400, "1");
const newToken = issueTokenWithNewFamily(user.id);`}</code>
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                      <span>CWE-294 Check</span>
                      <span>•</span>
                      <span className="text-emerald-400">Security Grade: Resolved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Prompts Pills */}
              <div className="p-3 bg-[#080d19] border-t border-white/5">
                <p className="text-[11px] text-slate-500 mb-2 font-mono">Suggested Inquiries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {queryExamples.slice(0, 3).map((query, i) => (
                    <button
                      key={i}
                      className="px-2 py-1 rounded bg-[#0f172a] hover:bg-slate-800 text-[10px] text-slate-300 border border-white/5 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      <span className="truncate max-w-[200px]">{query}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
