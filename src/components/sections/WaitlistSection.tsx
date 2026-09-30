"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, CheckCircle } from "lucide-react";

interface WaitlistResult {
  position?: number;
  alreadyRegistered?: boolean;
}

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const issues = data.issues as { message: string }[] | undefined;
        if (issues?.[0]) {
          setError(issues[0].message);
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      setResult({
        position: data.data?.position,
        alreadyRegistered: data.data?.alreadyRegistered,
      });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="py-32 lg:py-40 border-t border-[var(--color-vx-border)]"
      aria-labelledby="waitlist-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Ambient glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 80%, color-mix(in srgb, var(--color-vx-accent) 8%, transparent), transparent)",
          }}
        />

        <div className="relative">
          <div className="vx-label text-[var(--color-vx-accent)] mb-6">
            Early access
          </div>

          <h2
            id="waitlist-heading"
            className="vx-h1 text-[var(--color-vx-text-primary)] mb-5"
          >
            Join the waitlist.
          </h2>

          <p className="vx-body-lg text-[var(--color-vx-text-secondary)] mb-10 max-w-xl mx-auto">
            VOXY is in private beta. Access is rolling out gradually
            to ensure every user gets a stable, complete experience.
            Early members receive a permanent discount at launch.
          </p>

          {result ? (
            <SuccessState result={result} />
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              noValidate
            >
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error ?? undefined}
                  required
                  autoComplete="email"
                  aria-label="Email address for waitlist"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                loading={loading}
                iconRight={!loading ? <ArrowRight size={14} /> : undefined}
                className="shrink-0 sm:self-start"
              >
                Join waitlist
              </Button>
            </form>
          )}

          <p className="mt-5 text-xs text-[var(--color-vx-text-muted)]">
            No spam. No marketing emails. Just an invite when your spot is ready.
          </p>
        </div>
      </div>
    </section>
  );
}

function SuccessState({ result }: { result: WaitlistResult }) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-4 p-8 rounded-2xl",
        "border border-[color-mix(in_srgb,var(--color-vx-success)_30%,transparent)]",
        "bg-[color-mix(in_srgb,var(--color-vx-success)_6%,transparent)]",
        "animate-in fade-in zoom-in-95 duration-300"
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle
        size={32}
        className="text-[var(--color-vx-success)]"
        aria-hidden="true"
      />
      <div>
        <p className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-1">
          {result.alreadyRegistered
            ? "You're already on the list."
            : "You're on the list."}
        </p>
        {result.position && !result.alreadyRegistered && (
          <p className="text-sm text-[var(--color-vx-text-secondary)]">
            Position{" "}
            <span className="font-mono text-[var(--color-vx-accent)]">
              #{result.position}
            </span>{" "}
            — we&apos;ll reach out when your slot opens.
          </p>
        )}
        {result.alreadyRegistered && (
          <p className="text-sm text-[var(--color-vx-text-secondary)]">
            We already have your email. We&apos;ll be in touch.
          </p>
        )}
      </div>
    </div>
  );
}
