"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-vx-accent)] text-white",
    "hover:bg-[var(--color-vx-accent-hover)]",
    "active:scale-[0.98]",
    "shadow-[0_0_24px_-4px_color-mix(in_srgb,var(--color-vx-accent)_50%,transparent)]",
    "hover:shadow-[0_0_32px_-4px_color-mix(in_srgb,var(--color-vx-accent)_70%,transparent)]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
  ].join(" "),

  secondary: [
    "bg-[var(--color-vx-surface)] text-[var(--color-vx-text-primary)]",
    "border border-[var(--color-vx-border)]",
    "hover:bg-[var(--color-vx-overlay)] hover:border-[var(--color-vx-border-hover)]",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--color-vx-text-primary)]",
    "border border-[var(--color-vx-border-hover)]",
    "hover:bg-[var(--color-vx-surface)] hover:border-[var(--color-vx-border-focus)]",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--color-vx-text-secondary)]",
    "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  danger: [
    "bg-[var(--color-vx-error)] text-white",
    "hover:opacity-90",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-7 px-3 text-xs gap-1.5 rounded-md",
  sm: "h-8 px-3.5 text-sm gap-2 rounded-md",
  md: "h-10 px-5 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-2 focus-visible:outline-[var(--color-vx-accent)] focus-visible:outline-offset-2",
          "select-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0" size={size === "xs" ? 12 : 14} />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
