export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative w-10 h-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-vx-border)]" />
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-vx-accent)] border-t-transparent animate-spin" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
