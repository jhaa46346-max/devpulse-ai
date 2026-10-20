"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Terminal,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Redirect to target destination
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("developer@devpulse.ai");
    setPassword("DevPulse2026!");
    setError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Terminal className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to DevPulse AI</h1>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your developer intelligence console.
        </p>
      </div>

      {/* Demo Credentials Helper Box */}
      <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-cyan-300 font-medium font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Demo Credentials Available
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            developer@devpulse.ai • DevPulse2026!
          </p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
        >
          Auto Fill
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0c1220] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#0c1220] border border-white/10 text-xs text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={loading}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {loading ? "Authenticating..." : "Sign In to Workspace"}
        </Button>
      </form>

      <div className="text-center space-y-2 text-xs text-slate-400">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
        <p>
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to DevPulse Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-center items-center p-4 bg-grid-pattern selection:bg-cyan-500/20 selection:text-cyan-300">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
