"use client";

import type { MissionProposal } from "@/lib/types";

interface MissionCardProps {
  mission: MissionProposal;
}

export default function MissionCard({ mission }: MissionCardProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mission header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 mb-4">
          <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          {mission.mission_name}
        </h2>
        <p className="text-[var(--text-dim)]">{mission.mission_goal}</p>
      </div>

      {/* Steps */}
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--surface-border)] p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Steps to Complete
        </h3>
        <div className="space-y-3">
          {mission.steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-[var(--primary)]">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-[var(--foreground)] pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signals */}
      <div className="grid grid-cols-1 gap-4">
        {/* Success signal */}
        <div className="bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-semibold text-[var(--primary)]">
              Success Signal
            </h4>
          </div>
          <p className="text-sm text-[var(--foreground)]">
            {mission.success_signal}
          </p>
        </div>

        {/* Failure signal */}
        <div className="bg-[var(--secondary)]/5 rounded-xl border border-[var(--secondary)]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="text-sm font-semibold text-[var(--secondary)]">
              Failure Signal
            </h4>
          </div>
          <p className="text-sm text-[var(--foreground)]">
            {mission.failure_signal}
          </p>
        </div>
      </div>

      {/* Time estimate */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] rounded-full border border-[var(--surface-border)]">
          <svg className="w-4 h-4 text-[var(--text-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-[var(--text-dim)]">
            Complete within 7 days
          </span>
        </div>
      </div>
    </div>
  );
}
