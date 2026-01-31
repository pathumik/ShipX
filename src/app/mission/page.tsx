"use client";

import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MissionCard from "@/components/MissionCard";
import LogForm from "@/components/LogForm";
import type { MissionLog, LearningUpdate } from "@/lib/types";

export default function MissionPage() {
  const { state, logMissionResult, setCurrentStep } = useSession();
  const router = useRouter();
  const [showLogForm, setShowLogForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if no mission
    if (!state.nickname) {
      router.push("/");
      return;
    }
    if (!state.mission) {
      router.push("/map");
      return;
    }
  }, [state.nickname, state.mission, router]);

  const handleLogResult = async (log: MissionLog) => {
    if (!state.structure || !state.mission) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Call AI to interpret learning
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call: "learning",
          risky_assumption: state.structure.risky_assumption,
          mission_name: state.mission.mission_name,
          mission_log: log,
        }),
      });

      if (!res.ok) throw new Error("Failed to interpret learning");
      const data = await res.json();
      const learningUpdate: LearningUpdate = data.result;

      // Log the result
      logMissionResult(log, learningUpdate);
      setCurrentStep("map");
      router.push("/map");
    } catch (err) {
      console.error("Log error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/map");
  };

  if (!state.mission) {
    return null;
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between border-b border-[var(--surface-border)]">
        <button
          onClick={handleBack}
          className="p-2 text-[var(--text-dim)] hover:text-[var(--foreground)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          {showLogForm ? "Log Results" : "Your Mission"}
        </h1>
        <div className="w-10" />
      </header>

      {/* Main content */}
      <div className="flex-1 relative z-10 overflow-y-auto p-4">
        {showLogForm ? (
          <LogForm
            missionName={state.mission.mission_name}
            onSubmit={handleLogResult}
            onCancel={() => setShowLogForm(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <MissionCard mission={state.mission} />
        )}

        {error && (
          <div className="mt-4 p-4 bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 rounded-xl">
            <p className="text-[var(--secondary)] text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {!showLogForm && (
        <footer className="relative z-10 p-4 pb-6">
          <button
            onClick={() => setShowLogForm(true)}
            className="w-full py-4 px-8 rounded-xl text-lg font-semibold btn-glow"
          >
            Log Mission Results
          </button>
        </footer>
      )}
    </div>
  );
}
