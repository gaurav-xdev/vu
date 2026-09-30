import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-5xl font-bold text-[var(--color-vx-border-hover)] mb-6">
          404
        </p>
        <h1 className="vx-h3 text-[var(--color-vx-text-primary)] mb-3">
          Page not found
        </h1>
        <p className="text-sm text-[var(--color-vx-text-secondary)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          variant="secondary"
          icon={<ArrowLeft size={14} />}
        >
          <Link href="/" className="contents">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
