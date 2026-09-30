import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-vx-surface)] text-[var(--color-vx-text-secondary)] border border-[var(--color-vx-border)]",
  accent: "bg-[color-mix(in_srgb,var(--color-vx-accent)_15%,transparent)] text-[var(--color-vx-accent)] border border-[color-mix(in_srgb,var(--color-vx-accent)_30%,transparent)]",
  success: "bg-[color-mix(in_srgb,var(--color-vx-success)_12%,transparent)] text-[var(--color-vx-success)] border border-[color-mix(in_srgb,var(--color-vx-success)_25%,transparent)]",
  warning: "bg-[color-mix(in_srgb,var(--color-vx-warning)_12%,transparent)] text-[var(--color-vx-warning)] border border-[color-mix(in_srgb,var(--color-vx-warning)_25%,transparent)]",
  error: "bg-[color-mix(in_srgb,var(--color-vx-error)_12%,transparent)] text-[var(--color-vx-error)] border border-[color-mix(in_srgb,var(--color-vx-error)_25%,transparent)]",
  muted: "bg-transparent text-[var(--color-vx-text-muted)] border border-[var(--color-vx-border)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-vx-text-secondary)]",
  accent: "bg-[var(--color-vx-accent)]",
  success: "bg-[var(--color-vx-success)]",
  warning: "bg-[var(--color-vx-warning)]",
  error: "bg-[var(--color-vx-error)]",
  muted: "bg-[var(--color-vx-text-muted)]",
};

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
