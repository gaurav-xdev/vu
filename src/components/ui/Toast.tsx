"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const styles: Record<ToastType, string> = {
  success: "border-[var(--color-vx-success)] text-[var(--color-vx-success)]",
  error: "border-[var(--color-vx-error)] text-[var(--color-vx-error)]",
  warning: "border-[var(--color-vx-warning)] text-[var(--color-vx-warning)]",
  info: "border-[var(--color-vx-accent)] text-[var(--color-vx-accent)]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: Omit<Toast, "id">) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { ...opts, id }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => toast({ type: "success", title, description }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ type: "error", title, description }),
    [toast]
  );
  const warning = useCallback(
    (title: string, description?: string) => toast({ type: "warning", title, description }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ type: "info", title, description }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 max-w-sm w-full",
              "bg-[var(--color-vx-raised)] border rounded-xl p-4",
              "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              "animate-in slide-in-from-right-8 fade-in duration-300",
              styles[t.type]
            )}
          >
            <span className="shrink-0 mt-0.5">{icons[t.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-vx-text-primary)]">
                {t.title}
              </p>
              {t.description && (
                <p className="text-xs text-[var(--color-vx-text-secondary)] mt-0.5">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)] transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
