"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to observability service in production
    if (process.env.NODE_ENV !== "production") {
      console.error("[app-error]", error.digest, error.message);
    } else {
      console.error("[app-error]", error.digest);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[color-mix(in_srgb,var(--color-vx-error)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-vx-error)_25%,transparent)] mb-6">
          <AlertTriangle
            size={28}
            className="text-[var(--color-vx-error)]"
            aria-hidden="true"
          />
        </div>
        <h1 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--color-vx-text-secondary)] mb-6">
          An unexpected error occurred. This has been logged automatically.
          {error.digest && (
            <span className="block mt-2 font-mono text-[10px] text-[var(--color-vx-text-muted)]">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <Button
          onClick={reset}
          icon={<RefreshCcw size={14} />}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
