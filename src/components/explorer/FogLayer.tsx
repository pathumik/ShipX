"use client";

import { useMemo } from "react";
import type { FogState } from "@/lib/types";

interface FogLayerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fogState: FogState;
  clarity: number;
}

// Calculate darkness opacity based on clarity score
function getDarknessOpacity(clarity: number): number {
  if (clarity >= 80) return 0.05;  // Almost fully explored
  if (clarity >= 60) return 0.2;   // Mostly clear
  if (clarity >= 40) return 0.4;   // Partial darkness
  if (clarity >= 20) return 0.6;   // Heavy darkness
  return 0.75;                      // Very dark - unexplored
}

export default function FogLayer({
  x,
  y,
  width,
  height,
  fogState,
  clarity,
}: FogLayerProps) {
  // Calculate dynamic opacity based on clarity
  const opacity = useMemo(() => getDarknessOpacity(clarity), [clarity]);
  
  // Generate unique gradient ID
  const gradientId = useMemo(() => `darkness-${x}-${y}`, [x, y]);

  // If clarity is very high, don't render darkness
  if (clarity >= 90) {
    return null;
  }

  return (
    <g className="fog-layer" style={{ pointerEvents: "none" }}>
      {/* Darkness gradient definition */}
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0d0d0f" stopOpacity={opacity * 0.3} />
          <stop offset="60%" stopColor="#0d0d0f" stopOpacity={opacity * 0.7} />
          <stop offset="100%" stopColor="#0d0d0f" stopOpacity={opacity} />
        </radialGradient>
      </defs>

      {/* Main darkness layer with radial gradient */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
        style={{
          transition: "opacity 0.8s ease-out",
        }}
      />

      {/* Unexplored indicator when darkness is heavy */}
      {fogState === "high" && clarity < 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#3a3a42"
          fontSize="11"
          fontWeight="500"
          letterSpacing="2"
          style={{
            fontFamily: "var(--font-header)",
            textTransform: "uppercase",
          }}
        >
          UNEXPLORED
        </text>
      )}
    </g>
  );
}
