import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "emerald" | "rose" | "none";
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = "none",
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: "",
    cyan: "hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10",
    emerald: "hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10",
    rose: "hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-[#0d131f]/90 backdrop-blur-md p-5 transition-all duration-200",
        interactive && "cursor-pointer hover:bg-[#121b2d] hover:-translate-y-0.5",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
