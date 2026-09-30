"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Check, Minus } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "For individuals exploring VOXY.",
    cta: "Start free",
    href: "/auth/register",
    featured: false,
    limits: "50 voice commands/day · 1 device",
    features: [
      { label: "Voice command processing", included: true },
      { label: "Context reading (1 active app)", included: true },
      { label: "Basic task execution", included: true },
      { label: "Local processing only", included: true },
      { label: "Multi-app context", included: false },
      { label: "Custom automation scripts", included: false },
      { label: "Team workspace", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 29, annual: 23 },
    description: "For professionals who live in the command layer.",
    cta: "Request access",
    href: "/auth/register?plan=pro",
    featured: true,
    limits: "Unlimited commands · 3 devices",
    features: [
      { label: "Voice command processing", included: true },
      { label: "Context reading (all open apps)", included: true },
      { label: "Advanced task execution", included: true },
      { label: "Local processing only", included: true },
      { label: "Multi-app context", included: true },
      { label: "Custom automation scripts", included: true },
      { label: "Team workspace", included: false },
      { label: "Priority support", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    description: "For teams requiring custom deployment and governance.",
    cta: "Talk to us",
    href: "mailto:enterprise@voxy.app",
    featured: false,
    limits: "Unlimited · Custom deployment",
    features: [
      { label: "Voice command processing", included: true },
      { label: "Context reading (all open apps)", included: true },
      { label: "Advanced task execution", included: true },
      { label: "Self-hosted processing", included: true },
      { label: "Multi-app context", included: true },
      { label: "Custom automation scripts", included: true },
      { label: "Team workspace", included: true },
      { label: "Dedicated support", included: true },
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="py-32 lg:py-40 border-t border-[var(--color-vx-border)]"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="vx-label text-[var(--color-vx-accent)] mb-4">
            Pricing
          </div>
          <h2
            id="pricing-heading"
            className="vx-h1 text-[var(--color-vx-text-primary)] mb-4"
          >
            Transparent pricing.
            <br />
            No surprises.
          </h2>
          <p className="vx-body-lg text-[var(--color-vx-text-secondary)] max-w-xl mx-auto mb-8">
            VOXY is in private beta. Prices shown are planned at launch.
            Early access users receive a 40% permanent discount.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3">
            <span
              className={cn(
                "text-sm transition-colors",
                !annual
                  ? "text-[var(--color-vx-text-primary)]"
                  : "text-[var(--color-vx-text-muted)]"
              )}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative w-10 h-6 rounded-full border transition-all duration-300",
                annual
                  ? "bg-[var(--color-vx-accent)] border-[var(--color-vx-accent)]"
                  : "bg-[var(--color-vx-surface)] border-[var(--color-vx-border)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white",
                  "transition-transform duration-300",
                  annual ? "translate-x-4" : "translate-x-0"
                )}
              />
              <span className="sr-only">
                {annual ? "Switch to monthly billing" : "Switch to annual billing"}
              </span>
            </button>
            <span
              className={cn(
                "text-sm flex items-center gap-2 transition-colors",
                annual
                  ? "text-[var(--color-vx-text-primary)]"
                  : "text-[var(--color-vx-text-muted)]"
              )}
            >
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-vx-success)_15%,transparent)] text-[var(--color-vx-success)] border border-[color-mix(in_srgb,var(--color-vx-success)_30%,transparent)]">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} annual={annual} />
          ))}
        </div>

        <p className="text-center text-xs text-[var(--color-vx-text-muted)] mt-10">
          All plans include 30-day cancellation. No questions asked.
          Prices are planned — not yet charged during beta.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  annual,
}: {
  plan: (typeof plans)[0];
  annual: boolean;
}) {
  const price = plan.price
    ? annual
      ? plan.price.annual
      : plan.price.monthly
    : null;

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 flex flex-col",
        "transition-all duration-300",
        plan.featured
          ? "border-[var(--color-vx-accent)] bg-[var(--color-vx-raised)] shadow-[0_0_40px_-10px_color-mix(in_srgb,var(--color-vx-accent)_30%,transparent)]"
          : "border-[var(--color-vx-border)] bg-[var(--color-vx-base)]"
      )}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-vx-accent)] text-white">
            Most popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-1">
          {plan.name}
        </h3>
        <p className="text-sm text-[var(--color-vx-text-muted)]">
          {plan.description}
        </p>
      </div>

      <div className="mb-4">
        {price !== null ? (
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-[var(--color-vx-text-primary)] tracking-tight">
              ${price}
            </span>
            <span className="text-sm text-[var(--color-vx-text-muted)] mb-1.5">
              /mo
            </span>
          </div>
        ) : (
          <div className="text-2xl font-bold text-[var(--color-vx-text-primary)]">
            Custom
          </div>
        )}
        <p className="text-xs text-[var(--color-vx-text-muted)] mt-1">
          {plan.limits}
        </p>
      </div>

      <Button
        variant={plan.featured ? "primary" : "secondary"}
        fullWidth
        className="mb-6"
      >
        <Link href={plan.href} className="contents">
          {plan.cta}
        </Link>
      </Button>

      <ul className="flex flex-col gap-3 flex-1" role="list">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-3">
            <span
              className={cn(
                "shrink-0",
                feature.included
                  ? "text-[var(--color-vx-success)]"
                  : "text-[var(--color-vx-border-hover)]"
              )}
              aria-hidden="true"
            >
              {feature.included ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <Minus size={14} strokeWidth={2} />
              )}
            </span>
            <span
              className={cn(
                "text-sm",
                feature.included
                  ? "text-[var(--color-vx-text-secondary)]"
                  : "text-[var(--color-vx-text-muted)]"
              )}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
