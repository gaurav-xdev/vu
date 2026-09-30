import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)] transition-colors mb-12"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <h1 className="vx-h1 text-[var(--color-vx-text-primary)] mb-3">
        Terms of Service
      </h1>
      <p className="text-sm text-[var(--color-vx-text-muted)] mb-10">
        Last updated: January 2025 · Beta terms
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
            Beta status
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            VOXY is currently in private beta. Features may change, be removed,
            or behave unexpectedly. By using VOXY, you acknowledge that it
            is beta software and accept the associated risks.
            No charges are applied during the beta period.
          </p>
        </section>

        <section>
          <h2 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
            Acceptable use
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            You may use VOXY for lawful personal and professional purposes.
            You may not use VOXY to automate actions that violate third-party
            terms of service, engage in harassment, or circumvent security measures.
          </p>
        </section>

        <section>
          <h2 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
            Limitation of liability
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            VOXY is provided as-is during beta. We are not liable for data loss,
            unintended automation actions, or system changes resulting from
            VOXY&apos;s operation. You are responsible for reviewing
            and confirming actions before they execute.
          </p>
        </section>

        <section>
          <h2 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
            Contact
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            Questions about these terms?{" "}
            <a
              href="mailto:legal@voxy.app"
              className="text-[var(--color-vx-accent)] hover:underline"
            >
              legal@voxy.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
