"use client";

import { useState } from "react";
import type {
  MissionLog,
  CompletionStatus,
  ConfidenceLevel,
  Decision,
} from "@/lib/types";

interface LogFormProps {
  missionName: string;
  onSubmit: (log: MissionLog) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function LogForm({
  missionName,
  onSubmit,
  onCancel,
  isSubmitting,
}: LogFormProps) {
  // Base fields
  const [completed, setCompleted] = useState<CompletionStatus>("partial");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("medium");
  const [decision, setDecision] = useState<Decision>("continue");
  const [notes, setNotes] = useState("");

  // Mission-specific fields
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [recurringProblem, setRecurringProblem] = useState(false);
  const [painIntensity, setPainIntensity] = useState<"low" | "medium" | "high">("medium");
  const [strongestSignal, setStrongestSignal] = useState("");

  const [exposedCount, setExposedCount] = useState(0);
  const [actedCount, setActedCount] = useState(0);

  const [impressions, setImpressions] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [signups, setSignups] = useState(0);

  const [spikeCompleted, setSpikeCompleted] = useState(false);
  const [blockerFound, setBlockerFound] = useState(false);

  const [expertRole, setExpertRole] = useState("");
  const [verdict, setVerdict] = useState<"possible" | "risky" | "impossible">("possible");
  const [keyWarning, setKeyWarning] = useState("");

  const [channelUsed, setChannelUsed] = useState("");
  const [responseRate, setResponseRate] = useState(0);

  const [mainSubstitute, setMainSubstitute] = useState("");
  const [switchingFriction, setSwitchingFriction] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseLog = {
      completed,
      confidence,
      decision,
      notes: notes || undefined,
    };

    let log: MissionLog;

    switch (missionName) {
      case "Problem Interview":
        log = {
          ...baseLog,
          mission_name: "Problem Interview",
          interviews_count: interviewsCount,
          recurring_problem_observed: recurringProblem,
          pain_intensity: painIntensity,
          strongest_signal: strongestSignal || undefined,
        };
        break;
      case "Willingness-to-Act Test":
        log = {
          ...baseLog,
          mission_name: "Willingness-to-Act Test",
          exposed_count: exposedCount,
          acted_count: actedCount,
          conversion_rate: exposedCount > 0 ? (actedCount / exposedCount) * 100 : 0,
        };
        break;
      case "Fake Door Test":
        log = {
          ...baseLog,
          mission_name: "Fake Door Test",
          impressions,
          clicks,
          signups,
        };
        break;
      case "Technical / Operational Spike":
        log = {
          ...baseLog,
          mission_name: "Technical / Operational Spike",
          spike_completed: spikeCompleted,
          blocker_found: blockerFound,
          confidence_before: "low",
          confidence_after: confidence,
        };
        break;
      case "Expert Reality Check":
        log = {
          ...baseLog,
          mission_name: "Expert Reality Check",
          expert_role: expertRole,
          verdict,
          key_warning: keyWarning || undefined,
        };
        break;
      case "Channel Constraint Test":
        log = {
          ...baseLog,
          mission_name: "Channel Constraint Test",
          channel_used: channelUsed,
          response_rate: responseRate,
        };
        break;
      case "Substitute Analysis":
        log = {
          ...baseLog,
          mission_name: "Substitute Analysis",
          main_substitute: mainSubstitute,
          switching_friction: switchingFriction,
        };
        break;
      default:
        return;
    }

    onSubmit(log);
  };

  const renderMissionFields = () => {
    switch (missionName) {
      case "Problem Interview":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Number of Interviews
              </label>
              <input
                type="number"
                min={0}
                value={interviewsCount}
                onChange={(e) => setInterviewsCount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Recurring Problem Observed?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecurringProblem(true)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    recurringProblem
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setRecurringProblem(false)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    !recurringProblem
                      ? "bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Pain Intensity
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPainIntensity(level)}
                    className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                      painIntensity === level
                        ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                        : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Strongest Signal (optional)
              </label>
              <input
                type="text"
                value={strongestSignal}
                onChange={(e) => setStrongestSignal(e.target.value)}
                placeholder="What stood out most?"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </>
        );

      case "Willingness-to-Act Test":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                People Exposed
              </label>
              <input
                type="number"
                min={0}
                value={exposedCount}
                onChange={(e) => setExposedCount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                People Who Acted
              </label>
              <input
                type="number"
                min={0}
                value={actedCount}
                onChange={(e) => setActedCount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            {exposedCount > 0 && (
              <p className="text-sm text-[var(--text-dim)]">
                Conversion rate: {((actedCount / exposedCount) * 100).toFixed(1)}%
              </p>
            )}
          </>
        );

      case "Fake Door Test":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Impressions
              </label>
              <input
                type="number"
                min={0}
                value={impressions}
                onChange={(e) => setImpressions(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Clicks
              </label>
              <input
                type="number"
                min={0}
                value={clicks}
                onChange={(e) => setClicks(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Signups
              </label>
              <input
                type="number"
                min={0}
                value={signups}
                onChange={(e) => setSignups(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </>
        );

      case "Technical / Operational Spike":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Spike Completed?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSpikeCompleted(true)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    spikeCompleted
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setSpikeCompleted(false)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    !spikeCompleted
                      ? "bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Blocker Found?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBlockerFound(true)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    blockerFound
                      ? "bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setBlockerFound(false)}
                  className={`flex-1 py-3 rounded-lg border transition-all ${
                    !blockerFound
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </>
        );

      case "Expert Reality Check":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Expert Role
              </label>
              <input
                type="text"
                value={expertRole}
                onChange={(e) => setExpertRole(e.target.value)}
                placeholder="e.g., Senior Engineer, Industry Consultant"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Verdict
              </label>
              <div className="flex gap-2">
                {(["possible", "risky", "impossible"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVerdict(v)}
                    className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                      verdict === v
                        ? v === "possible"
                          ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                          : v === "risky"
                          ? "bg-[var(--tertiary)]/20 border-[var(--tertiary)] text-[var(--tertiary)]"
                          : "bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)]"
                        : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Key Warning (optional)
              </label>
              <input
                type="text"
                value={keyWarning}
                onChange={(e) => setKeyWarning(e.target.value)}
                placeholder="Main concern raised"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </>
        );

      case "Channel Constraint Test":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Channel Used
              </label>
              <input
                type="text"
                value={channelUsed}
                onChange={(e) => setChannelUsed(e.target.value)}
                placeholder="e.g., LinkedIn, Cold Email, Reddit"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Response Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={responseRate}
                onChange={(e) => setResponseRate(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </>
        );

      case "Substitute Analysis":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Main Substitute
              </label>
              <input
                type="text"
                value={mainSubstitute}
                onChange={(e) => setMainSubstitute(e.target.value)}
                placeholder="What do users currently use instead?"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Switching Friction
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSwitchingFriction(level)}
                    className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                      switchingFriction === level
                        ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                        : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Log Your Results
        </h2>
        <p className="text-sm text-[var(--text-dim)]">{missionName}</p>
      </div>

      {/* Mission-specific fields */}
      {renderMissionFields()}

      {/* Base fields */}
      <div className="pt-4 border-t border-[var(--surface-border)]">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Completion Status
          </label>
          <div className="flex gap-2">
            {(["yes", "partial", "no"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setCompleted(status)}
                className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                  completed === status
                    ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Evidence Confidence
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setConfidence(level)}
                className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                  confidence === level
                    ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Decision
          </label>
          <div className="flex gap-2">
            {(["continue", "pivot", "pause"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDecision(d)}
                className={`flex-1 py-3 rounded-lg border capitalize transition-all ${
                  decision === d
                    ? d === "continue"
                      ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]"
                      : d === "pivot"
                      ? "bg-[var(--tertiary)]/20 border-[var(--tertiary)] text-[var(--tertiary)]"
                      : "bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)]"
                    : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-dim)]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional observations..."
            rows={3}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 py-4 px-6 rounded-xl border border-[var(--surface-border)] text-[var(--foreground)] font-medium hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 px-6 rounded-xl btn-glow disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Results"}
        </button>
      </div>
    </form>
  );
}
