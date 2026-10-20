import React from "react";
import { cn } from "@/lib/utils";
import { SeverityLevel } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  severity?: SeverityLevel;
  variant?: "neutral" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  severity,
  variant,
  size = "sm",
  className,
  dot = false,
}) => {
  // Determine variant based on severity if provided
  let effectiveVariant = variant || "neutral";
  if (severity) {
    switch (severity) {
      case "critical":
        effectiveVariant = "error";
        break;
      case "high":
        effectiveVariant = "warning";
        break;
      case "medium":
        effectiveVariant = "info";
        break;
      case "low":
        effectiveVariant = "neutral";
        break;
      case "info":
        effectiveVariant = "purple";
        break;
    }
  }

  const variantStyles = {
    neutral: "bg-slate-800/80 text-slate-300 border-slate-700/80",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-950/40 text-amber-300 border-amber-500/30",
    error: "bg-rose-950/40 text-rose-300 border-rose-500/30",
    info: "bg-cyan-950/40 text-cyan-300 border-cyan-500/30",
    purple: "bg-purple-950/40 text-purple-300 border-purple-500/30",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
    info: "bg-cyan-400",
    purple: "bg-purple-400",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded-md border",
        sizeStyles[size],
        variantStyles[effectiveVariant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", dotColors[effectiveVariant])}
        />
      )}
      {children}
    </span>
  );
};
