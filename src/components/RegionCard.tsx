"use client";

import type { MapRegionUI } from "@/lib/mapModel";
import { useState } from "react";

interface RegionCardProps {
  region: MapRegionUI;
  isPrimary: boolean;
}

const REGION_COLORS = {
  demand: {
    gradient: "from-[#00f5d4] to-[#00c4a7]",
    bg: "bg-[#00f5d4]/10",
    border: "border-[#00f5d4]/30",
    text: "text-[#00f5d4]",
  },
  feasibility: {
    gradient: "from-[#9b5de5] to-[#7a4ab8]",
    bg: "bg-[#9b5de5]/10",
    border: "border-[#9b5de5]/30",
    text: "text-[#9b5de5]",
  },
  timing: {
    gradient: "from-[#f9c74f] to-[#e0a82e]",
    bg: "bg-[#f9c74f]/10",
    border: "border-[#f9c74f]/30",
    text: "text-[#f9c74f]",
  },
};

const FOG_STYLES = {
  high: {
    overlay: "opacity-70",
    badge: "bg-[var(--secondary)]/20 text-[var(--secondary)]",
    label: "High Fog",
  },
  medium: {
    overlay: "opacity-40",
    badge: "bg-[var(--tertiary)]/20 text-[var(--tertiary)]",
    label: "Medium Fog",
  },
  low: {
    overlay: "opacity-10",
    badge: "bg-[var(--primary)]/20 text-[var(--primary)]",
    label: "Clear",
  },
};

export default function RegionCard({ region, isPrimary }: RegionCardProps) {
  const [isExpanded, setIsExpanded] = useState(isPrimary);
  const colors = REGION_COLORS[region.id];
  const fog = FOG_STYLES[region.fog_state];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 card-hover ${
        isPrimary
          ? `${colors.border} ${colors.bg}`
          : "border-[var(--surface-border)] bg-[var(--surface)]"
      }`}
    >
      {/* Fog overlay */}
      <div
        className={`absolute inset-0 bg-[var(--background)] pointer-events-none transition-opacity duration-500 ${fog.overlay}`}
      />

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Region icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}
            >
              {region.id === "demand" && (
                <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {region.id === "feasibility" && (
                <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {region.id === "timing" && (
                <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--foreground)]">
                  {region.title}
                </h3>
                {isPrimary && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)] rounded-full">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-dim)]">{region.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fog badge */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${fog.badge}`}>
              {fog.label}
            </span>
            {/* Expand icon */}
            <svg
              className={`w-5 h-5 text-[var(--text-dim)] transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Clarity bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Clarity</span>
            <span className={`font-medium ${colors.text}`}>
              {Math.round(region.clarity_score)}%
            </span>
          </div>
          <div className="h-2 bg-[var(--surface-border)] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
              style={{ width: `${region.clarity_score}%` }}
            />
          </div>
        </div>

        {/* Expanded content - Nodes */}
        {isExpanded && region.nodes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--surface-border)]">
            <p className="text-xs text-[var(--text-muted)] mb-3">Checkpoints</p>
            <div className="space-y-2">
              {region.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg border transition-all ${
                    node.status === "locked"
                      ? "bg-[var(--surface)] border-[var(--surface-border)] opacity-50"
                      : node.status === "completed"
                      ? `${colors.bg} ${colors.border}`
                      : "bg-[var(--surface-elevated)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Status icon */}
                      {node.status === "locked" && (
                        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      {node.status === "available" && (
                        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {node.status === "completed" && (
                        <svg className={`w-4 h-4 ${colors.text}`} fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {node.title}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] capitalize">
                      {node.kind}
                    </span>
                  </div>
                  {node.prompt && node.status !== "locked" && (
                    <p className="mt-2 text-xs text-[var(--text-dim)]">
                      {node.prompt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
