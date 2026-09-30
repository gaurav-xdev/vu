"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect) {
      const clickedInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!clickedInside) onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className={cn(
        "fixed inset-0 z-50 m-auto w-full p-0 rounded-2xl",
        "bg-[var(--color-vx-raised)] border border-[var(--color-vx-border)]",
        "shadow-[0_24px_80px_rgba(0,0,0,0.6)]",
        "backdrop:bg-[rgba(5,5,8,0.7)] backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in open:zoom-in-95 open:duration-200",
        sizes[size],
        className
      )}
      aria-modal="true"
      aria-label={title}
    >
      <div className="p-6">
        {(title || description) && (
          <div className="mb-5">
            <div className="flex items-center justify-between gap-4">
              {title && (
                <h2 className="text-lg font-semibold text-[var(--color-vx-text-primary)]">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className={cn(
                  "shrink-0 p-1.5 rounded-lg",
                  "text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)]",
                  "hover:bg-[var(--color-vx-surface)] transition-colors"
                )}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            {description && (
              <p className="mt-1 text-sm text-[var(--color-vx-text-secondary)]">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
