import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

const changelog = [
  {
    version: "0.9.2",
    date: "2025-01-15",
    type: "beta" as const,
    title: "Improved noise rejection in open-plan environments",
    notes: [
      "VAD engine now adapts threshold dynamically based on ambient noise profile",
      "Reduced false-positive activation by approximately 60% in busy settings",
      "Fixed edge case where HVAC noise triggered unintended commands",
    ],
  },
  {
    version: "0.9.1",
    date: "2025-01-02",
    type: "beta" as const,
    title: "Multi-app context rollout",
    notes: [
      "Context engine now reads state from up to 6 simultaneously open applications",
      "Xcode, Safari, Notion, and Terminal support verified and stable",
      "Context switching latency reduced from ~800ms to ~120ms",
    ],
  },
  {
    version: "0.9.0",
    date: "2024-12-18",
    type: "beta" as const,
    title: "Private beta launch",
    notes: [
      "Core voice activation and intent parsing live for invited users",
      "AppleScript execution bridge stable on Apple Silicon (M1–M4)",
      "Task reasoning with chain-of-thought decomposition enabled",
      "Rollback engine supports undo for executed automation sequences",
    ],
  },
  {
    version: "0.8.5",
    date: "2024-11-30",
    type: "alpha" as const,
    title: "Security hardening pass",
    notes: [
      "Sandboxed execution context per application",
      "Local Keychain integration for credential management",
      "Audit log now persists all automation actions with full metadata",
    ],
  },
];

const typeBadge: Record<"beta" | "alpha" | "stable", React.ComponentProps<typeof Badge>["variant"]> = {
  beta: "accent",
  alpha: "warning",
  stable: "success",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ChangelogSection() {
  return (
    <section
      id="changelog"
      className="py-32 lg:py-40 border-t border-[var(--color-vx-border)]"
      aria-labelledby="changelog-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
          {/* Left */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="vx-label text-[var(--color-vx-accent)] mb-4">
              Changelog
            </div>
            <h2
              id="changelog-heading"
              className="vx-h2 text-[var(--color-vx-text-primary)] mb-4"
            >
              What&apos;s been
              <br />
              shipping.
            </h2>
            <p className="vx-body text-[var(--color-vx-text-secondary)]">
              Every release. No marketing language.
              Just what changed, what improved, and what we fixed.
            </p>
          </div>

          {/* Right — entries */}
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-vx-accent)] via-[var(--color-vx-border)] to-transparent"
              aria-hidden="true"
              style={{ marginLeft: "-1px" }}
            />

            <div className="flex flex-col gap-12 pl-8">
              {changelog.map((entry) => (
                <ChangelogEntry key={entry.version} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChangelogEntry({ entry }: { entry: (typeof changelog)[0] }) {
  return (
    <article className="relative">
      {/* Timeline dot */}
      <div
        className="absolute -left-[2.25rem] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--color-vx-accent)] bg-[var(--color-vx-void)]"
        aria-hidden="true"
      />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <code className="font-mono text-sm text-[var(--color-vx-text-primary)]">
          v{entry.version}
        </code>
        <Badge variant={typeBadge[entry.type]}>
          {entry.type}
        </Badge>
        <time
          dateTime={entry.date}
          className="text-xs text-[var(--color-vx-text-muted)]"
        >
          {formatDate(entry.date)}
        </time>
      </div>

      <h3 className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-3">
        {entry.title}
      </h3>

      <ul className="flex flex-col gap-2" role="list">
        {entry.notes.map((note, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-2 w-1 h-1 rounded-full bg-[var(--color-vx-text-muted)] shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-[var(--color-vx-text-secondary)]">
              {note}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
