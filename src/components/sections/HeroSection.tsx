"use client";

import { useRef, useState, useEffect } from "react";
import { VoxyCore } from "@/components/3d/VoxyCore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { ArrowRight, Command } from "lucide-react";
import Link from "next/link";

function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={cn(
        "inline-block transition-all",
        "duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {text}
    </span>
  );
}

// ─── Keyboard hint component ─────────────────────────────────────────────────

function KeyboardHint() {
  return (
    <div
      className="flex items-center gap-2 text-xs text-[var(--color-vx-text-muted)]"
      aria-label="Activate VOXY with Command + Space"
    >
      <span>Activate with</span>
      <kbd className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-vx-surface)] border border-[var(--color-vx-border)] rounded font-mono text-[10px] text-[var(--color-vx-text-secondary)]">
        <Command size={10} />
        <span>Space</span>
      </kbd>
    </div>
  );
}

// ─── Orbit indicators ─────────────────────────────────────────────────────────

function OrbitDots() {
  const dots = [
    { angle: 15, label: "Voice recognition", distance: "48%" },
    { angle: 135, label: "Context awareness", distance: "52%" },
    { angle: 250, label: "System integration", distance: "49%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {dots.map(({ angle, label, distance }) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * parseFloat(distance);
        const y = 50 + Math.sin(rad) * parseFloat(distance);

        return (
          <div
            key={label}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-vx-accent)] opacity-60" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[var(--color-vx-accent)] animate-ping opacity-25" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,106,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,106,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 60% 50%,
              color-mix(in srgb, #7c6aff 8%, transparent) 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-32">

          {/* Left — copy */}
          <div className="flex flex-col items-start">
            <div
              className="mb-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationFillMode: "forwards" }}
            >
              <Badge variant="accent" dot>
                Private beta — limited access
              </Badge>
            </div>

            <h1
              id="hero-heading"
              className="vx-display text-[var(--color-vx-text-primary)] mb-6"
            >
              <AnimatedText
                text="Your operating"
                className="block"
                delay={100}
              />
              <AnimatedText
                text="companion."
                className="block text-[var(--color-vx-accent)]"
                delay={200}
              />
            </h1>

            <div
              className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationFillMode: "forwards", animationDelay: "350ms" }}
            >
              <p className="vx-body-lg text-[var(--color-vx-text-secondary)] max-w-[440px] mb-8">
                VOXY sits quietly at the edge of your macOS environment. Speak naturally.
                It understands your context, executes across your open applications,
                and reasons through complex workflows — without interrupting your flow.
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-4 mb-10 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationFillMode: "forwards", animationDelay: "450ms" }}
            >
              <Button
                size="lg"
                iconRight={<ArrowRight size={16} />}
              >
                <Link href="/auth/register" className="contents">
                  Request access
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
              >
                <a href="#product" className="contents">
                  See how it works
                </a>
              </Button>
            </div>

            <div
              className="opacity-0 animate-in fade-in duration-700"
              style={{ animationFillMode: "forwards", animationDelay: "600ms" }}
            >
              <KeyboardHint />
            </div>

            {/* Technical indicators */}
            <div
              className="mt-12 flex items-center gap-6 opacity-0 animate-in fade-in duration-700"
              style={{ animationFillMode: "forwards", animationDelay: "700ms" }}
            >
              <Indicator label="macOS 13+" status="active" />
              <div className="w-px h-4 bg-[var(--color-vx-border)]" />
              <Indicator label="Apple Silicon native" status="active" />
              <div className="w-px h-4 bg-[var(--color-vx-border)]" />
              <Indicator label="Local-first" status="active" />
            </div>
          </div>

          {/* Right — 3D */}
          <div className="relative h-[500px] lg:h-[640px]">
            <OrbitDots />
            <VoxyCore className="absolute inset-0" />

            {/* Caption below orb */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <p className="text-xs text-[var(--color-vx-text-muted)] tracking-wider uppercase">
                VOXY Core • v0.9 Beta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-[var(--color-vx-border)] to-transparent" />
      </div>
    </section>
  );
}

function Indicator({
  label,
  status,
}: {
  label: string;
  status: "active" | "inactive" | "pending";
}) {
  const colors = {
    active: "bg-[var(--color-vx-success)]",
    inactive: "bg-[var(--color-vx-text-muted)]",
    pending: "bg-[var(--color-vx-warning)]",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", colors[status])}
        aria-hidden="true"
      />
      <span className="text-xs text-[var(--color-vx-text-muted)]">{label}</span>
    </div>
  );
}
