import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "VOXY privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p className="text-sm text-[var(--color-vx-text-muted)] mb-10">
        Last updated: January 2025
      </p>

      <div className="prose-custom space-y-8">
        <section aria-labelledby="privacy-summary">
          <h2
            id="privacy-summary"
            className="vx-h3 text-[var(--color-vx-text-primary)] mb-3"
          >
            The short version
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            VOXY is designed to be local-first. Voice processing, context reading,
            and task execution happen on your device. We do not sell your data.
            We do not send audio to external servers without your explicit opt-in.
            Account information (email, plan) is stored securely on our servers
            only for authentication and billing purposes.
          </p>
        </section>

        <section aria-labelledby="privacy-data">
          <h2
            id="privacy-data"
            className="vx-h3 text-[var(--color-vx-text-primary)] mb-3"
          >
            What we collect
          </h2>
          <ul className="vx-body text-[var(--color-vx-text-secondary)] space-y-2 list-disc list-inside">
            <li>Email address and account credentials (required for authentication)</li>
            <li>Billing information processed by Stripe (we do not store card details)</li>
            <li>Anonymized crash reports (opt-in, disabled by default)</li>
            <li>Aggregate usage statistics (opt-in, disabled by default)</li>
          </ul>
        </section>

        <section aria-labelledby="privacy-not-collect">
          <h2
            id="privacy-not-collect"
            className="vx-h3 text-[var(--color-vx-text-primary)] mb-3"
          >
            What we do not collect
          </h2>
          <ul className="vx-body text-[var(--color-vx-text-secondary)] space-y-2 list-disc list-inside">
            <li>Voice recordings or transcripts</li>
            <li>Content from your applications</li>
            <li>Files, documents, or clipboard contents</li>
            <li>Screen captures or screenshots</li>
            <li>Keystrokes or passwords</li>
          </ul>
        </section>

        <section aria-labelledby="privacy-contact">
          <h2
            id="privacy-contact"
            className="vx-h3 text-[var(--color-vx-text-primary)] mb-3"
          >
            Contact
          </h2>
          <p className="vx-body text-[var(--color-vx-text-secondary)]">
            For privacy questions, contact{" "}
            <a
              href="mailto:privacy@voxy.app"
              className="text-[var(--color-vx-accent)] hover:underline"
            >
              privacy@voxy.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
