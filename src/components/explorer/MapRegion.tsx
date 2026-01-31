"use client";

import type { ReactNode } from "react";
import type { Region } from "@/lib/mapModel";
import FogLayer from "./FogLayer";

interface RegionConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
}

interface MapRegionProps {
  region: Region;
  config: RegionConfig;
  isPrimary: boolean;
  onClick: () => void;
  children?: ReactNode;
}

// Subtle region tints - barely visible differentiation
const REGION_TINTS: Record<string, string> = {
  demand: "rgba(74, 222, 128, 0.02)",      // Green hint
  feasibility: "rgba(96, 165, 250, 0.02)", // Blue hint
  timing: "rgba(245, 200, 66, 0.02)",      // Yellow hint
};

// Region descriptions - shown on hover in panel
const REGION_DESCRIPTIONS: Record<string, string> = {
  demand: "Will people want this?",
  feasibility: "Can this be built?",
  timing: "Is now the right time?",
};

// Helper to get region label (handles both old 'title' and new 'label' properties)
function getRegionLabel(region: Region): string {
  return region.label || (region as unknown as { title?: string }).title || region.id || "Unknown";
}

// Helper to get region clarity (handles both old 'clarity_score' and new 'clarity' properties)
function getRegionClarity(region: Region): number {
  return region.clarity ?? (region as unknown as { clarity_score?: number }).clarity_score ?? 0;
}

// Helper to get region fog (handles both old 'fog_state' and new 'fog' properties)
function getRegionFog(region: Region): "high" | "medium" | "low" {
  return region.fog || (region as unknown as { fog_state?: "high" | "medium" | "low" }).fog_state || "high";
}

export default function MapRegion({
  region,
  config,
  isPrimary,
  onClick,
  children,
}: MapRegionProps) {
  const regionLabel = getRegionLabel(region);
  const regionTint = REGION_TINTS[regionLabel.toLowerCase()] || "transparent";
  const clarity = getRegionClarity(region);
  const fog = getRegionFog(region);

  // Border color based on primary state
  const borderColor = isPrimary ? "#f5c842" : "#2a2a32";
  const borderOpacity = isPrimary ? 0.5 : 0.3;

  return (
    <g
      className={`map-region ${isPrimary ? "region-primary" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Region background - subtle tint */}
      <rect
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        fill={regionTint}
        rx="4"
      />

      {/* Boundary line - dashed for implicit, solid for primary */}
      <rect
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        fill="none"
        stroke={borderColor}
        strokeWidth={isPrimary ? 1.5 : 1}
        strokeDasharray={isPrimary ? "none" : "4 8"}
        opacity={borderOpacity}
        rx="4"
      />

      {/* Region label - subtle, fades in on hover */}
      <text
        x={config.labelX}
        y={config.labelY}
        className="region-label"
        fill={isPrimary ? "#f5c842" : "#4a4a54"}
        fontSize="10"
        fontWeight="500"
        textAnchor="middle"
        letterSpacing="2"
        style={{ 
          fontFamily: "var(--font-header)",
          textTransform: "uppercase",
        }}
      >
        {regionLabel.toUpperCase()}
      </text>

      {/* Edge progress bar (right side) */}
      <g transform={`translate(${config.x + config.width - 8}, ${config.y + 50})`}>
        {/* Background */}
        <rect
          x="0"
          y="0"
          width="4"
          height={config.height - 100}
          fill="#1a1a20"
          rx="2"
        />
        {/* Progress fill */}
        <rect
          x="0"
          y={(config.height - 100) * (1 - clarity / 100)}
          width="4"
          height={(config.height - 100) * (clarity / 100)}
          fill={clarity >= 70 ? "#4ade80" : clarity >= 40 ? "#60a5fa" : "#e54545"}
          rx="2"
          style={{ transition: "all 0.6s ease-out" }}
        />
      </g>

      {/* Primary indicator - subtle glow instead of badge */}
      {isPrimary && (
        <rect
          x={config.x - 1}
          y={config.y - 1}
          width={config.width + 2}
          height={config.height + 2}
          fill="none"
          stroke="#f5c842"
          strokeWidth="1"
          opacity="0.2"
          rx="5"
          filter="url(#glowFilter)"
        />
      )}

      {/* Darkness Layer (replaces fog) */}
      <FogLayer
        x={config.x}
        y={config.y + 80}
        width={config.width - 16}
        height={config.height - 100}
        fogState={fog}
        clarity={clarity}
      />

      {/* Nodes rendered as children */}
      {children}
    </g>
  );
}
