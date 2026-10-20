"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  FolderGit2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  codeSnippet?: string;
  timestamp: string;
}

export default function AssistantPage() {
  const [projects, setProjects] = useState<Array<{ id: string; name: string; language: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Explain this project architecture",
    "Are there active security issues in this codebase?",
    "Find the bug in the primary handler",
    "Generate comprehensive unit tests for this service",
    "How can I improve and optimize this code?",
  ];

  // Load project list
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.projects.length > 0) {
            setProjects(data.projects);
            setSelectedProjectId(data.projects[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }
    loadProjects();
  }, []);

  // Load chat session for selected project
  useEffect(() => {
    if (!selectedProjectId) return;

    async function loadChat() {
      try {
        const res = await fetch(`/api/assistant/chat?projectId=${selectedProjectId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.session.messages.length > 0) {
            setMessages(data.session.messages);
          } else {
            // Initial greeting if no messages yet
            const currentProj = projects.find((p) => p.id === selectedProjectId);
            setMessages([
              {
                id: "initial-greeting",
                sender: "assistant",
                content: `Hello! I am the DevPulse AI Assistant. I have indexed the source files and security telemetry for project **${
                  currentProj?.name || "your codebase"
                }** (${currentProj?.language || "TypeScript"}).\n\nHow can I help you audit security findings, diagnose bugs, or synthesize tests today?`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
    loadChat();
  }, [selectedProjectId, projects]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || !selectedProjectId) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          projectId: selectedProjectId,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message.id,
            sender: data.message.sender,
            content: data.message.content,
            codeSnippet: data.message.codeSnippet,
            timestamp: new Date(data.message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to get AI answer");
      }
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          content: "Sorry, I encountered an issue retrieving project telemetry. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">DevPulse AI Assistant</h1>
            <Badge variant="info" size="sm" dot>
              Project-Grounded Context
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Converse directly with an AI engineer that understands your files, security findings, and symbols.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            Project Context:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#0c1220] text-xs text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.language})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-white/10 bg-[#0a0f1d]/90 backdrop-blur-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === "user"
                  ? "bg-slate-700 text-slate-200"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20"
              }`}
            >
              {msg.sender === "user" ? "DEV" : <Bot className="w-4 h-4 text-slate-950" />}
            </div>

            <div
              className={`p-4 rounded-xl text-xs space-y-2 leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-100"
                  : "bg-[#0f172a] border border-white/10 text-slate-200"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.codeSnippet && (
                <div className="relative mt-2 p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto group">
                  <button
                    onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 border border-white/5"
                  >
                    {copiedSnippetId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedSnippetId === msg.id ? "Copied" : "Copy"}
                  </button>
                  <pre>
                    <code>{msg.codeSnippet}</code>
                  </pre>
                </div>
              )}

              <div className="text-[10px] text-slate-500 font-mono text-right pt-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing {currentProject?.name} context & formulating response...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono text-slate-500 shrink-0">Quick Prompts:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-[#0e1628] hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-[11px] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-2 rounded-xl border border-white/10 bg-[#0a0f1d] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Ask DevPulse AI about ${currentProject?.name || "your codebase"}...`}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
        />
        <Button
          size="sm"
          variant="primary"
          icon={<Send className="w-3.5 h-3.5" />}
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
