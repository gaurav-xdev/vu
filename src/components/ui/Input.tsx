"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide uppercase text-[var(--color-vx-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-[var(--color-vx-text-muted)] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 px-3.5 py-2",
              "bg-[var(--color-vx-surface)] text-[var(--color-vx-text-primary)]",
              "border rounded-lg",
              "text-sm placeholder:text-[var(--color-vx-text-muted)]",
              "transition-colors duration-150",
              "focus:outline-none focus:border-[var(--color-vx-accent)] focus:ring-1 focus:ring-[var(--color-vx-accent)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-[var(--color-vx-error)]"
                : "border-[var(--color-vx-border)] hover:border-[var(--color-vx-border-hover)]",
              icon && "pl-9",
              iconRight && "pr-9",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-[var(--color-vx-text-muted)]">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[var(--color-vx-error)]"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-[var(--color-vx-text-muted)]"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
