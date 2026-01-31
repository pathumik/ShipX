"use client";

import type { TimelineEntry } from "@/lib/types";

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: '#1a1a20',
            border: '1px dashed #2a2a32'
          }}
        >
          <svg className="w-10 h-10" fill="none" stroke="#4a4a54" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#f0f0f0' }}>
          Empty Journey Log
        </h3>
        <p className="text-sm max-w-xs" style={{ color: '#6a6a78' }}>
          Complete your first mission to begin recording your discoveries and learnings.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <h3 
        className="text-sm font-semibold mb-6 sticky top-0 py-4 uppercase tracking-widest"
        style={{ 
          color: '#6a6a78', 
          backgroundColor: '#0d0d0f',
        }}
      >
        JOURNEY LOG
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div 
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{ 
            background: 'linear-gradient(180deg, #2a2a32 0%, #1a1a20 80%, transparent 100%)'
          }}
        />

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="relative pl-12 expedition-log-entry"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-3.5 w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    entry.learning_update.updated_confidence === "high"
                      ? "#4ade80"
                      : entry.learning_update.updated_confidence === "medium"
                      ? "#60a5fa"
                      : "#3a3a42",
                  border: '2px solid #0d0d0f'
                }}
              />

              {/* Card */}
              <div 
                className="rounded-lg p-5"
                style={{ 
                  backgroundColor: '#141418',
                  border: '1px solid #2a2a32',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-base" style={{ color: '#f0f0f0' }}>
                      {entry.mission_name}
                    </h4>
                    <p 
                      className="text-xs mt-1"
                      style={{ color: '#6a6a78' }}
                    >
                      {new Date(entry.timestamp_iso).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-lg capitalize"
                    style={{
                      backgroundColor:
                        entry.mission_log.decision === "continue"
                          ? "rgba(74, 222, 128, 0.15)"
                          : entry.mission_log.decision === "pivot"
                          ? "rgba(96, 165, 250, 0.15)"
                          : "rgba(229, 69, 69, 0.15)",
                      color:
                        entry.mission_log.decision === "continue"
                          ? "#4ade80"
                          : entry.mission_log.decision === "pivot"
                          ? "#60a5fa"
                          : "#e54545",
                      border: `1px solid ${
                        entry.mission_log.decision === "continue"
                          ? "rgba(74, 222, 128, 0.3)"
                          : entry.mission_log.decision === "pivot"
                          ? "rgba(96, 165, 250, 0.3)"
                          : "rgba(229, 69, 69, 0.3)"
                      }`,
                    }}
                  >
                    {entry.mission_log.decision}
                  </span>
                </div>

                {/* Learning update */}
                <div className="space-y-3">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: '#1a1a20',
                      borderLeft: '3px solid #4ade80'
                    }}
                  >
                    <p 
                      className="text-xs mb-2 uppercase tracking-wider"
                      style={{ color: '#4ade80' }}
                    >
                      Discovery
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#f0f0f0' }}>
                      {entry.learning_update.what_changed}
                    </p>
                  </div>

                  {entry.learning_update.what_did_not_change && (
                    <div 
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: '#1a1a20',
                        borderLeft: '3px solid #e54545'
                      }}
                    >
                      <p 
                        className="text-xs mb-2 uppercase tracking-wider"
                        style={{ color: '#e54545' }}
                      >
                        Still Unknown
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#9a9aa8' }}>
                        {entry.learning_update.what_did_not_change}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer with confidence and focus */}
                <div 
                  className="mt-4 pt-3 flex flex-wrap items-center gap-3"
                  style={{ borderTop: '1px solid #2a2a32' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider" style={{ color: '#6a6a78' }}>
                      Evidence:
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded capitalize"
                      style={{
                        backgroundColor:
                          entry.learning_update.updated_confidence === "high"
                            ? "rgba(74, 222, 128, 0.15)"
                            : entry.learning_update.updated_confidence === "medium"
                            ? "rgba(96, 165, 250, 0.15)"
                            : "rgba(58, 58, 66, 0.5)",
                        color:
                          entry.learning_update.updated_confidence === "high"
                            ? "#4ade80"
                            : entry.learning_update.updated_confidence === "medium"
                            ? "#60a5fa"
                            : "#9a9aa8",
                      }}
                    >
                      {entry.learning_update.updated_confidence}
                    </span>
                  </div>
                  <span style={{ color: '#3a3a42' }}>→</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider" style={{ color: '#6a6a78' }}>
                      Next:
                    </span>
                    <span className="text-xs capitalize font-medium" style={{ color: '#f5c842' }}>
                      {entry.learning_update.recommended_next_focus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
