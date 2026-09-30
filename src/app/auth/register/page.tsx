import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/AuthForm";
import { VoxyCore } from "@/components/3d/VoxyCore";

export const metadata: Metadata = {
  title: "Request access",
  description: "Request early access to VOXY.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <AuthForm mode="register" />
      </div>

      {/* Right — 3D visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative bg-[var(--color-vx-base)] border-l border-[var(--color-vx-border)]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,106,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,106,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative w-[480px] h-[480px]">
          <VoxyCore className="absolute inset-0" />
        </div>

        <div className="absolute bottom-8 text-center">
          <p className="text-xs font-mono text-[var(--color-vx-text-muted)]">
            VOXY Core — on-device · local-first
          </p>
        </div>
      </div>
    </div>
  );
}
