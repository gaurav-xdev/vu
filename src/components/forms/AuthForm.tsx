"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

type Mode = "login" | "register";

interface ApiError {
  error?: string;
  issues?: { field: string; message: string }[];
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: values.email, password: values.password }
          : { email: values.email, password: values.password, displayName: values.displayName || undefined };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json() as { success: boolean; data?: unknown } & ApiError;

      if (!res.ok) {
        // Handle field-level errors
        if (data.issues) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of data.issues) {
            fieldErrors[issue.field] = issue.message;
          }
          setErrors(fieldErrors);
        } else {
          toastError(
            mode === "login" ? "Sign in failed" : "Registration failed",
            data.error ?? "Please try again."
          );
        }
        return;
      }

      success(
        mode === "login" ? "Welcome back." : "Account created.",
        mode === "login"
          ? "Signed in successfully."
          : "Your account is ready."
      );

      router.push("/dashboard");
      router.refresh();
    } catch {
      toastError(
        "Connection error",
        "Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 group"
          aria-label="Back to VOXY home"
        >
          <div className="w-6 h-6" aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="13" stroke="url(#authLogoGrad)" strokeWidth="1.5" />
              <path
                d="M8 10 L14 18 L20 10"
                stroke="url(#authLogoGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="14" cy="14" r="2" fill="url(#authLogoGrad)" />
              <defs>
                <linearGradient id="authLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#9580ff" />
                  <stop offset="100%" stopColor="#6040cc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--color-vx-text-secondary)] group-hover:text-[var(--color-vx-text-primary)] transition-colors">
            VOXY
          </span>
        </Link>

        <h1 className="vx-h2 text-[var(--color-vx-text-primary)] mb-2">
          {mode === "login" ? "Welcome back." : "Request access."}
        </h1>
        <p className="text-sm text-[var(--color-vx-text-muted)]">
          {mode === "login"
            ? "Sign in to your VOXY account."
            : "Create your account for beta access."}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        noValidate
        aria-label={mode === "login" ? "Sign in form" : "Registration form"}
      >
        {mode === "register" && (
          <Input
            label="Display name"
            type="text"
            placeholder="Jane Smith"
            value={values.displayName}
            onChange={set("displayName")}
            error={errors.displayName}
            icon={<User size={14} />}
            autoComplete="name"
            autoFocus
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          icon={<Mail size={14} />}
          autoComplete={mode === "login" ? "email" : "email"}
          autoFocus={mode === "login"}
          required
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
            value={values.password}
            onChange={set("password")}
            error={errors.password}
            icon={<Lock size={14} />}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />

          {mode === "register" && (
            <p className="mt-1.5 text-[11px] text-[var(--color-vx-text-muted)]">
              Minimum 8 characters, one uppercase, one lowercase, one number.
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          className="mt-2"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--color-vx-text-muted)]">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link
              href="/auth/register"
              className="text-[var(--color-vx-accent)] hover:underline"
            >
              Request access
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[var(--color-vx-accent)] hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>

      {mode === "register" && (
        <p className="mt-4 text-center text-[11px] text-[var(--color-vx-text-muted)] leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[var(--color-vx-text-secondary)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-vx-text-secondary)]">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </div>
  );
}
