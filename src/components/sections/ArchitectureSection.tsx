"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

const layers = [
  {
    id: "voice",
    level: "01",
    name: "Voice Layer",
    description: "On-device speech processing. Zero audio leaves your machine.",
    components: ["VAD Engine", "Noise Gate", "Intent Parser"],
    color: "#9580ff",
    dark: "#2d1b6e",
  },
  {
    id: "context",
    level: "02",
    name: "Context Engine",
    description: "Reads application state through accessibility APIs without screen capture.",
    components: ["AX Tree Reader", "Window Manager", "State Graph"],
    color: "#7c6aff",
    dark: "#1f1458",
  },
  {
    id: "reasoning",
    level: "03",
    name: "Reasoning Core",
    description: "Decomposes user intent into structured, reversible execution plans.",
    components: ["Task Planner", "Action Chain", "Rollback Engine"],
    color: "#6040cc",
    dark: "#160d40",
  },
  {
    id: "execution",
    level: "04",
    name: "Execution Layer",
    description: "Interfaces directly with macOS native APIs. Sandboxed per application.",
    components: ["AppleScript Bridge", "Swift Runtime", "Audit Log"],
    color: "#4a2fb8",
    dark: "#100a30",
  },
  {
    id: "privacy",
    level: "05",
    name: "Privacy Boundary",
    description: "A hard boundary between local processing and any optional cloud features.",
    components: ["Local Keychain", "Data Policy Engine", "Opt-in Sync"],
    color: "#f5a623",
    dark: "#3a2208",
  },
];

export function ArchitectureSection() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <section
      id="architecture"
      className="py-32 lg:py-40 border-t border-[var(--color-vx-border)]"
      aria-labelledby="arch-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — description */}
          <div className="lg:sticky lg:top-32">
            <div className="vx-label text-[var(--color-vx-accent)] mb-4">
              System design
            </div>
            <h2
              id="arch-heading"
              className="vx-h1 text-[var(--color-vx-text-primary)] mb-5"
            >
              Built on a
              <br />
              layered architecture.
            </h2>
            <p className="vx-body-lg text-[var(--color-vx-text-secondary)] mb-8">
              VOXY is not a thin wrapper over a cloud API.
              Each layer has a distinct responsibility, a defined
              interface, and an explicit privacy contract.
            </p>

            {/* Active layer detail */}
            {activeLayer ? (
              <LayerDetail layer={layers.find((l) => l.id === activeLayer)!} />
            ) : (
              <p className="text-sm text-[var(--color-vx-text-muted)] italic">
                Hover a layer to inspect it.
              </p>
            )}
          </div>

          {/* Right — stack diagram */}
          <div className="flex flex-col gap-2">
            {layers.map((layer, i) => (
              <LayerBlock
                key={layer.id}
                layer={layer}
                index={i}
                active={activeLayer === layer.id}
                onEnter={() => setActiveLayer(layer.id)}
                onLeave={() => setActiveLayer(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LayerBlock({
  layer,
  index,
  active,
  onEnter,
  onLeave,
}: {
  layer: (typeof layers)[0];
  index: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`${layer.name} — ${layer.description}`}
      aria-pressed={active}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnter();
        }
      }}
      className={cn(
        "group relative rounded-xl border px-5 py-4 cursor-default",
        "transition-all duration-300",
        active
          ? "border-[var(--color-vx-border-hover)] bg-[var(--color-vx-raised)]"
          : "border-[var(--color-vx-border)] bg-[var(--color-vx-base)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-vx-accent)] focus-visible:outline-offset-2"
      )}
      style={{
        borderLeftColor: active ? layer.color : undefined,
        borderLeftWidth: "3px",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="font-mono text-xs shrink-0 w-6"
          style={{ color: layer.color, opacity: 0.6 }}
        >
          {layer.level}
        </span>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-sm font-semibold transition-colors duration-200",
              active
                ? "text-[var(--color-vx-text-primary)]"
                : "text-[var(--color-vx-text-secondary)]"
            )}
          >
            {layer.name}
          </div>
          {active && (
            <p className="text-xs text-[var(--color-vx-text-muted)] mt-0.5 line-clamp-1">
              {layer.description}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 shrink-0">
          {layer.components.map((c, ci) => (
            <div
              key={c}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                active ? "opacity-80" : "opacity-25"
              )}
              style={{
                backgroundColor: layer.color,
                transitionDelay: `${ci * 60}ms`,
                transform: active ? "scale(1)" : "scale(0.6)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LayerDetail({ layer }: { layer: (typeof layers)[0] }) {
  return (
    <div
      className="rounded-xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-5 animate-in fade-in duration-200"
      style={{ borderLeftColor: layer.color, borderLeftWidth: "3px" }}
    >
      <div className="font-mono text-xs mb-1" style={{ color: layer.color }}>
        Layer {layer.level}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-2">
        {layer.name}
      </h3>
      <p className="text-sm text-[var(--color-vx-text-secondary)] mb-4">
        {layer.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {layer.components.map((c) => (
          <span
            key={c}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono"
            style={{
              backgroundColor: `${layer.dark}`,
              color: layer.color,
              border: `1px solid ${layer.color}30`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
