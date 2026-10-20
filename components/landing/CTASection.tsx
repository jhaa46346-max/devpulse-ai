import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import { Button } from "../ui/Button";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#080c14] to-[#04060a] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/20">
          <Terminal className="w-7 h-7 text-slate-950 font-bold" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ready to Elevate Your Codebase Intelligence?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Audit bugs, uncover vulnerabilities, and collaborate with DevPulse AI across your software
          lifecycle.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Open DevPulse Console
            </Button>
          </Link>
          <Link href="/dashboard/analyzer">
            <Button size="lg" variant="outline">
              Run Free Code Scan
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local execution mode • No credit card required • Zero key retention</span>
        </div>
      </div>
    </section>
  );
};
