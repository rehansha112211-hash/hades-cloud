"use client";

/**
 * Next.js App Router error boundary.
 * Catches any uncaught errors in the route and shows a fallback.
 * This prevents the white "Application error" screen.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md text-center">
        <h2 className="font-display text-xl font-bold mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          An error occurred while loading the page. You can try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
