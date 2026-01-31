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

// Calculate fog opacity based on clarity score
function getFogOpacity(clarity: number): number {
  if (clarity >= 70) return 0.1;   // Almost clear - low fog
  if (clarity >= 40) return 0.4;   // Partial fog
  return 0.7;                       // Heavy fog
}

// Get CSS class for fog state
function getFogClass(fogState: FogState): string {
  switch (fogState) {
    case "low":
      return "fog-low";
    case "medium":
      return "fog-medium";
    case "high":
    default:
      return "fog-high";
  }
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
  const opacity = useMemo(() => getFogOpacity(clarity), [clarity]);
  const fogClass = getFogClass(fogState);

  // Generate fog pattern with organic shapes
  const fogPatternId = useMemo(() => `fogPattern-${x}-${y}`, [x, y]);
  
  // Create organic cloud-like shapes for fog
  const cloudPaths = useMemo(() => {
    const paths: string[] = [];
    const numClouds = 5;
    const cloudWidth = width / numClouds;
    
    for (let i = 0; i < numClouds; i++) {
      const cx = x + cloudWidth * i + cloudWidth / 2;
      const cy = y + height / 2 + Math.sin(i * 0.8) * 30;
      const r1 = 40 + Math.sin(i * 1.2) * 15;
      const r2 = 30 + Math.cos(i * 0.9) * 10;
      
      // Create blobby cloud shape using circles
      paths.push(`
        M ${cx - r1} ${cy}
        Q ${cx - r1} ${cy - r2}, ${cx} ${cy - r2}
        Q ${cx + r1} ${cy - r2}, ${cx + r1} ${cy}
        Q ${cx + r1} ${cy + r2}, ${cx} ${cy + r2}
        Q ${cx - r1} ${cy + r2}, ${cx - r1} ${cy}
        Z
      `);
    }
    
    return paths;
  }, [x, y, width, height]);

  // If clarity is very high, don't render fog
  if (clarity >= 90) {
    return null;
  }

  return (
    <g className={`fog-layer ${fogClass}`} style={{ pointerEvents: "none" }}>
      {/* Fog gradient definition */}
      <defs>
        <linearGradient id={fogPatternId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e4c1" stopOpacity={opacity} />
          <stop offset="30%" stopColor="#e8d4a8" stopOpacity={opacity * 0.8} />
          <stop offset="70%" stopColor="#f4e4c1" stopOpacity={opacity * 0.9} />
          <stop offset="100%" stopColor="#e8d4a8" stopOpacity={opacity} />
        </linearGradient>

        {/* Blur filter for soft fog edges */}
        <filter id={`fogBlur-${x}-${y}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {/* Base fog rectangle with gradient */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${fogPatternId})`}
        style={{
          transition: "opacity 1.2s ease-out",
          opacity: opacity,
        }}
      />

      {/* Organic cloud shapes overlay */}
      {cloudPaths.map((path, index) => (
        <path
          key={index}
          d={path}
          fill="#f4e4c1"
          filter={`url(#fogBlur-${x}-${y})`}
          style={{
            opacity: opacity * 0.6,
            transition: "opacity 1.2s ease-out",
          }}
        />
      ))}

      {/* Animated shimmer effect for mysterious feeling */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="url(#fogShimmer)"
        style={{
          opacity: opacity * 0.3,
          mixBlendMode: "overlay",
        }}
      />

      {/* Mystery text indicator when fog is heavy */}
      {fogState === "high" && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#8b7355"
          fontSize="14"
          fontStyle="italic"
          style={{
            fontFamily: "var(--font-body)",
            opacity: 0.5,
          }}
        >
          Unexplored Territory
        </text>
      )}
    </g>
  );
}
