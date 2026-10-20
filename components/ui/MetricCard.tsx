import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  accentColor?: "cyan" | "emerald" | "amber" | "rose" | "violet";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "cyan",
}) => {
  const iconBackgrounds = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <Card className="relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{value}</span>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium font-mono px-1.5 py-0.5 rounded",
                  trend.positive
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-rose-400 bg-rose-500/10"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div
          className={cn(
            "p-2.5 rounded-lg border flex items-center justify-center shrink-0",
            iconBackgrounds[accentColor]
          )}
        >
          {icon}
        </div>
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
          accentColor === "cyan" && "bg-cyan-500",
          accentColor === "emerald" && "bg-emerald-500",
          accentColor === "amber" && "bg-amber-500",
          accentColor === "rose" && "bg-rose-500",
          accentColor === "violet" && "bg-violet-500"
        )}
      />
    </Card>
  );
};
