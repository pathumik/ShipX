"use client";

import { useState } from "react";
import { useSession } from "@/context/SessionContext";

interface SaveJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveJourneyModal({ isOpen, onClose }: SaveJourneyModalProps) {
  const { state, setWaitlistSaved } = useSession();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.nickname,
          email,
          idea_summary: state.structure?.idea_statement || "",
          primary_uncertainty: state.classification?.primary_uncertainty,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(true);
      setWaitlistSaved(true);

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl border border-[var(--surface-border)] p-6 animate-slide-up">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              You&apos;re on the list!
            </h3>
            <p className="text-sm text-[var(--text-dim)]">
              We&apos;ll notify you when ShipX is ready for you to continue your journey.
            </p>
          </div>
        ) : (
          <>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                Save Your Journey, {state.nickname}?
              </h3>
              <p className="text-sm text-[var(--text-dim)]">
                Join the waitlist to get notified when ShipX launches. We&apos;ll save your progress so you can pick up where you left off.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-[var(--surface-elevated)] border border-[var(--surface-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-[var(--secondary)] text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full py-4 px-6 rounded-xl btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Join Waitlist"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-sm text-[var(--text-dim)] hover:text-[var(--foreground)] transition-colors"
              >
                Skip for now
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-[var(--text-muted)]">
              Your data stays in your browser. We only store your email to notify you.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
