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
            backgroundColor: '#e8d4a8',
            border: '2px dashed #8b7355'
          }}
        >
          <svg className="w-10 h-10" fill="none" stroke="#8b7355" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: '#2c2416', fontFamily: 'var(--font-header)' }}
        >
          Empty Expedition Log
        </h3>
        <p 
          className="text-sm max-w-xs"
          style={{ color: '#8b7355', fontFamily: 'var(--font-body)' }}
        >
          Complete your first mission to begin recording your discoveries and learnings.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <h3 
        className="text-xl font-semibold mb-6 sticky top-0 py-4"
        style={{ 
          color: '#2c2416', 
          fontFamily: 'var(--font-header)',
          backgroundColor: '#f4e4c1',
          letterSpacing: '2px'
        }}
      >
        EXPEDITION LOG
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div 
          className="absolute left-5 top-0 bottom-0 w-0.5"
          style={{ 
            background: 'linear-gradient(180deg, #8b7355 0%, #d4c49a 80%, transparent 100%)'
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
                      ? "#3a6b3a"
                      : entry.learning_update.updated_confidence === "medium"
                      ? "#3a5a8b"
                      : "#d4c49a",
                  border: '2px solid #8b7355'
                }}
              />

              {/* Card */}
              <div 
                className="rounded-lg p-5"
                style={{ 
                  backgroundColor: '#e8d4a8',
                  border: '1px solid #8b7355',
                  boxShadow: '2px 2px 8px rgba(139, 115, 85, 0.15)'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                      style={{ color: '#2c2416', fontFamily: 'var(--font-header)' }}
                    >
                      {entry.mission_name}
                    </h4>
                    <p 
                      className="text-xs mt-1"
                      style={{ 
                        color: '#8b7355', 
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.5px'
                      }}
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
                    className="px-3 py-1 text-xs font-medium rounded capitalize"
                    style={{
                      backgroundColor:
                        entry.mission_log.decision === "continue"
                          ? "rgba(58, 107, 58, 0.2)"
                          : entry.mission_log.decision === "pivot"
                          ? "rgba(58, 90, 139, 0.2)"
                          : "rgba(139, 58, 58, 0.2)",
                      color:
                        entry.mission_log.decision === "continue"
                          ? "#3a6b3a"
                          : entry.mission_log.decision === "pivot"
                          ? "#3a5a8b"
                          : "#8b3a3a",
                      fontFamily: 'var(--font-header)',
                      letterSpacing: '1px'
                    }}
                  >
                    {entry.mission_log.decision}
                  </span>
                </div>

                {/* Learning update */}
                <div className="space-y-3">
                  <div 
                    className="p-4 rounded"
                    style={{ 
                      backgroundColor: '#f4e4c1',
                      borderLeft: '3px solid #3a6b3a'
                    }}
                  >
                    <p 
                      className="text-xs mb-1 uppercase"
                      style={{ 
                        color: '#8b7355', 
                        fontFamily: 'var(--font-header)',
                        letterSpacing: '1px'
                      }}
                    >
                      Discovery
                    </p>
                    <p 
                      className="text-sm"
                      style={{ 
                        color: '#2c2416', 
                        fontFamily: 'var(--font-annotation)',
                        fontSize: '15px',
                        lineHeight: '1.5'
                      }}
                    >
                      {entry.learning_update.what_changed}
                    </p>
                  </div>

                  {entry.learning_update.what_did_not_change && (
                    <div 
                      className="p-4 rounded"
                      style={{ 
                        backgroundColor: '#f4e4c1',
                        borderLeft: '3px solid #8b3a3a'
                      }}
                    >
                      <p 
                        className="text-xs mb-1 uppercase"
                        style={{ 
                          color: '#8b7355', 
                          fontFamily: 'var(--font-header)',
                          letterSpacing: '1px'
                        }}
                      >
                        Still Unknown
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          color: '#4a3d2e', 
                          fontFamily: 'var(--font-annotation)',
                          fontSize: '15px',
                          lineHeight: '1.5'
                        }}
                      >
                        {entry.learning_update.what_did_not_change}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer with confidence and focus */}
                <div 
                  className="mt-4 pt-3 flex flex-wrap items-center gap-3"
                  style={{ borderTop: '1px dashed #8b7355' }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs uppercase"
                      style={{ 
                        color: '#8b7355', 
                        fontFamily: 'var(--font-header)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Evidence:
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded capitalize"
                      style={{
                        backgroundColor:
                          entry.learning_update.updated_confidence === "high"
                            ? "rgba(58, 107, 58, 0.2)"
                            : entry.learning_update.updated_confidence === "medium"
                            ? "rgba(58, 90, 139, 0.2)"
                            : "rgba(139, 115, 85, 0.2)",
                        color:
                          entry.learning_update.updated_confidence === "high"
                            ? "#3a6b3a"
                            : entry.learning_update.updated_confidence === "medium"
                            ? "#3a5a8b"
                            : "#8b7355",
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      {entry.learning_update.updated_confidence}
                    </span>
                  </div>
                  <span style={{ color: '#8b7355' }}>→</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs uppercase"
                      style={{ 
                        color: '#8b7355', 
                        fontFamily: 'var(--font-header)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Next Focus:
                    </span>
                    <span 
                      className="text-xs capitalize"
                      style={{ 
                        color: '#2c2416', 
                        fontFamily: 'var(--font-body)',
                        fontWeight: '600'
                      }}
                    >
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
