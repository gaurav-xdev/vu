"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// ─── Capability data — real product features ──────────────────────────────────

const capabilities = [
  {
    id: "voice",
    phase: "01",
    title: "Voice-first activation",
    body: "No wake word training required. VOXY detects contextual intent from natural speech patterns, not keyword matching. Noise rejection runs entirely on-device.",
    technical: "On-device VAD · Noise gate · CoreML inference",
    visual: "waveform",
  },
  {
    id: "context",
    phase: "02",
    title: "Cross-application context",
    body: "VOXY reads the accessibility tree of your frontmost application, understands the current document, selection, and cursor state — without screen capture or sending data externally.",
    technical: "Accessibility API · Privacy-preserving · Zero telemetry",
    visual: "context",
  },
  {
    id: "reasoning",
    phase: "03",
    title: "Structured task reasoning",
    body: "Complex workflows decompose into executable steps. Each action is shown before execution. You can interrupt, revise, or expand any step at any point.",
    technical: "Chain-of-thought · Interruptible · Rollback-capable",
    visual: "reasoning",
  },
  {
    id: "execution",
    phase: "04",
    title: "System-native execution",
    body: "VOXY scripts actions through native macOS APIs — not mouse simulation. Automations are deterministic, auditable, and reversible.",
    technical: "AppleScript bridge · Swift automation · Sandboxed",
    visual: "execution",
  },
];

// ─── Waveform animation ───────────────────────────────────────────────────────

function WaveformVisual({ active }: { active: boolean }) {
  const bars = Array.from({ length: 24 }, (_, i) => ({
    height: 20 + Math.sin(i * 0.7) * 15 + Math.random() * 20,
    delay: i * 40,
  }));

  return (
    <div
      className="flex items-center justify-center h-full gap-[3px]"
      aria-hidden="true"
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-300",
            active
              ? "bg-[var(--color-vx-accent)] opacity-80"
              : "bg-[var(--color-vx-border)] opacity-50"
          )}
          style={{
            height: active ? `${bar.height}%` : "8%",
            transitionDelay: active ? `${bar.delay}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
}

// ─── Context graph ────────────────────────────────────────────────────────────

function ContextVisual({ active }: { active: boolean }) {
  const nodes = [
    { x: 50, y: 50, label: "VOXY", primary: true },
    { x: 20, y: 25, label: "Safari" },
    { x: 80, y: 25, label: "Xcode" },
    { x: 15, y: 70, label: "Terminal" },
    { x: 80, y: 70, label: "Notion" },
    { x: 50, y: 85, label: "Finder" },
  ];

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.slice(1).map((node, i) => (
          <line
            key={i}
            x1="50" y1="50"
            x2={node.x} y2={node.y}
            stroke={active ? "rgba(124,106,255,0.4)" : "rgba(30,30,48,0.8)"}
            strokeWidth="0.5"
            className="transition-all duration-500"
            strokeDasharray={active ? "none" : "2,2"}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.label}
          className={cn(
            "absolute flex items-center justify-center",
            "transition-all duration-500 text-[9px] font-mono",
            node.primary
              ? "w-10 h-10 rounded-full border-2"
              : "w-8 h-8 rounded-lg border",
            active
              ? node.primary
                ? "border-[var(--color-vx-accent)] text-[var(--color-vx-accent)] shadow-[0_0_16px_-4px_var(--color-vx-accent)]"
                : "border-[var(--color-vx-border-hover)] text-[var(--color-vx-text-secondary)]"
              : "border-[var(--color-vx-border)] text-[var(--color-vx-text-muted)] opacity-40"
          )}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}

// ─── Reasoning chain ──────────────────────────────────────────────────────────

const reasoningSteps = [
  { step: "Parse intent", status: "done" },
  { step: "Identify active context", status: "done" },
  { step: "Decompose into 3 actions", status: "done" },
  { step: "Confirm before execute", status: "active" },
  { step: "Commit changes", status: "pending" },
];

function ReasoningVisual({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col justify-center h-full gap-2 px-4" aria-hidden="true">
      {reasoningSteps.map((step, i) => (
        <div
          key={step.step}
          className={cn(
            "flex items-center gap-3 text-xs font-mono transition-all duration-500",
            active ? "opacity-100" : "opacity-20"
          )}
          style={{ transitionDelay: active ? `${i * 80}ms` : "0ms" }}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
              step.status === "done" && active && "border-[var(--color-vx-success)] text-[var(--color-vx-success)]",
              step.status === "active" && active && "border-[var(--color-vx-accent)] text-[var(--color-vx-accent)]",
              step.status === "pending" && "border-[var(--color-vx-border)] text-[var(--color-vx-text-muted)]",
              !active && "border-[var(--color-vx-border)]"
            )}
          >
            {step.status === "done" && active ? "✓" : step.status === "active" && active ? "●" : "·"}
          </div>
          <span
            className={cn(
              step.status === "done" && active && "text-[var(--color-vx-text-secondary)] line-through decoration-[var(--color-vx-text-muted)]",
              step.status === "active" && active && "text-[var(--color-vx-text-primary)]",
              step.status === "pending" && "text-[var(--color-vx-text-muted)]"
            )}
          >
            {step.step}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Execution log ────────────────────────────────────────────────────────────

const execLines = [
  { prefix: "→", text: "open('Xcode')  // success", color: "text-[var(--color-vx-success)]" },
  { prefix: "→", text: "navigate('/src/components')", color: "text-[var(--color-vx-accent)]" },
  { prefix: "→", text: "select('Button.tsx')  // found", color: "text-[var(--color-vx-success)]" },
  { prefix: "→", text: "insertComment(selection)", color: "text-[var(--color-vx-accent)]" },
  { prefix: "✓", text: "Task complete  // 4 actions", color: "text-[var(--color-vx-success)]" },
];

function ExecutionVisual({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col justify-center h-full gap-1.5 px-4 font-mono text-xs" aria-hidden="true">
      {execLines.map((line, i) => (
        <div
          key={i}
          className={cn(
            "flex gap-2 transition-all duration-500",
            active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}
          style={{ transitionDelay: active ? `${i * 120}ms` : "0ms" }}
        >
          <span className={line.color}>{line.prefix}</span>
          <span className="text-[var(--color-vx-text-secondary)]">{line.text}</span>
        </div>
      ))}
    </div>
  );
}

function CapabilityVisual({
  type,
  active,
}: {
  type: string;
  active: boolean;
}) {
  if (type === "waveform") return <WaveformVisual active={active} />;
  if (type === "context") return <ContextVisual active={active} />;
  if (type === "reasoning") return <ReasoningVisual active={active} />;
  if (type === "execution") return <ExecutionVisual active={active} />;
  return null;
}

// ─── Intersection observer hook ───────────────────────────────────────────────

function useIntersection(ref: React.RefObject<Element | null>, threshold = 0.5) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return visible;
}

// ─── Capability Card ──────────────────────────────────────────────────────────

function CapabilityCard({
  capability,
  index,
}: {
  capability: (typeof capabilities)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<Element>, 0.3);

  return (
    <div
      ref={ref}
      className={cn(
        "grid md:grid-cols-2 gap-8 lg:gap-16 items-center",
        "transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        index % 2 !== 0 && "md:[&>*:first-child]:order-2"
      )}
    >
      {/* Text */}
      <div>
        <div className="vx-mono text-[var(--color-vx-accent)] mb-3 opacity-60">
          {capability.phase}
        </div>
        <h3 className="vx-h2 text-[var(--color-vx-text-primary)] mb-4">
          {capability.title}
        </h3>
        <p className="vx-body text-[var(--color-vx-text-secondary)] mb-6">
          {capability.body}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-vx-surface)] border border-[var(--color-vx-border)] rounded-lg">
          <span className="font-mono text-[10px] text-[var(--color-vx-text-muted)]">
            {capability.technical}
          </span>
        </div>
      </div>

      {/* Visual */}
      <div
        className={cn(
          "h-64 lg:h-80 rounded-2xl overflow-hidden",
          "bg-[var(--color-vx-raised)] border border-[var(--color-vx-border)]",
          "relative"
        )}
      >
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-4 py-3 border-b border-[var(--color-vx-border)]">
          <div className="w-2 h-2 rounded-full bg-[var(--color-vx-border-hover)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-vx-border-hover)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-vx-border-hover)]" />
          <span className="ml-2 text-[10px] font-mono text-[var(--color-vx-text-muted)]">
            voxy — {capability.id}
          </span>
        </div>
        <div className="h-full pt-10">
          <CapabilityVisual type={capability.visual} active={visible} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ProductSection() {
  return (
    <section
      id="product"
      className="py-32 lg:py-40"
      aria-labelledby="product-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-20 lg:mb-28">
          <div className="vx-label text-[var(--color-vx-accent)] mb-4">
            How it works
          </div>
          <h2
            id="product-heading"
            className="vx-h1 text-[var(--color-vx-text-primary)] mb-5"
          >
            Built for the way
            <br />
            professionals actually work.
          </h2>
          <p className="vx-body-lg text-[var(--color-vx-text-secondary)]">
            VOXY doesn&apos;t replace your workflow. It amplifies it.
            Every capability is designed around minimal interruption
            and maximum transparency.
          </p>
        </div>

        {/* Capabilities */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
