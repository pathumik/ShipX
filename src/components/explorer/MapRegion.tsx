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

// Region colors based on type
const REGION_COLORS: Record<string, string> = {
  demand: "rgba(58, 107, 58, 0.08)",
  feasibility: "rgba(58, 90, 139, 0.08)",
  timing: "rgba(139, 88, 58, 0.08)",
};

// Region descriptions
const REGION_DESCRIPTIONS: Record<string, string> = {
  demand: "Will people want this?",
  feasibility: "Can this be built?",
  timing: "Is now the right time?",
};

// Helper to get region label (handles both old 'title' and new 'label' properties)
function getRegionLabel(region: Region): string {
  // Handle both old and new data structures
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
  const regionColor = REGION_COLORS[regionLabel.toLowerCase()] || "rgba(139, 115, 85, 0.05)";
  const description = REGION_DESCRIPTIONS[regionLabel.toLowerCase()] || "";
  const clarity = getRegionClarity(region);
  const fog = getRegionFog(region);

  // Generate hand-drawn border path
  const generateBorderPath = () => {
    const { x, y, width, height } = config;
    const offset = 3; // Slight wobble
    
    // Create a slightly wobbly rectangle path
    return `
      M ${x + offset} ${y}
      Q ${x + width * 0.25} ${y - offset}, ${x + width * 0.5} ${y + offset}
      Q ${x + width * 0.75} ${y - offset}, ${x + width} ${y}
      Q ${x + width + offset} ${y + height * 0.25}, ${x + width - offset} ${y + height * 0.5}
      Q ${x + width + offset} ${y + height * 0.75}, ${x + width} ${y + height}
      Q ${x + width * 0.75} ${y + height + offset}, ${x + width * 0.5} ${y + height - offset}
      Q ${x + width * 0.25} ${y + height + offset}, ${x} ${y + height}
      Q ${x - offset} ${y + height * 0.75}, ${x + offset} ${y + height * 0.5}
      Q ${x - offset} ${y + height * 0.25}, ${x} ${y}
      Z
    `;
  };

  return (
    <g
      className={`map-region ${isPrimary ? "region-primary" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Region background */}
      <rect
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        fill={regionColor}
        rx="8"
      />

      {/* Hand-drawn style border */}
      <path
        d={generateBorderPath()}
        fill="none"
        stroke={isPrimary ? "#2c2416" : "#8b7355"}
        strokeWidth={isPrimary ? 2.5 : 1.5}
        strokeDasharray={isPrimary ? "none" : "12 6"}
        opacity={0.8}
      />

      {/* Region label */}
      <text
        x={config.labelX}
        y={config.labelY}
        className="region-label"
        fill={isPrimary ? "#2c2416" : "#8b7355"}
      >
        {regionLabel.toUpperCase()}
      </text>

      {/* Region description */}
      <text
        x={config.labelX}
        y={config.labelY + 18}
        className="region-sublabel"
      >
        {description}
      </text>

      {/* Clarity score */}
      <g transform={`translate(${config.x + config.width - 60}, ${config.y + 15})`}>
        <text
          x="0"
          y="0"
          fill="#8b7355"
          fontSize="10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Clarity
        </text>
        <text
          x="0"
          y="16"
          fill={clarity >= 70 ? "#3a6b3a" : clarity >= 40 ? "#3a5a8b" : "#8b3a3a"}
          fontSize="16"
          fontWeight="600"
          style={{ fontFamily: "var(--font-header)" }}
        >
          {Math.round(clarity)}%
        </text>
      </g>

      {/* Primary indicator badge */}
      {isPrimary && (
        <g transform={`translate(${config.x + 10}, ${config.y + 10})`}>
          <rect
            x="0"
            y="0"
            width="60"
            height="20"
            fill="#8b3a3a"
            rx="3"
          />
          <text
            x="30"
            y="14"
            textAnchor="middle"
            fill="#f4e4c1"
            fontSize="9"
            fontWeight="600"
            style={{ fontFamily: "var(--font-header)", letterSpacing: "1px" }}
          >
            PRIMARY
          </text>
        </g>
      )}

      {/* Fog Layer */}
      <FogLayer
        x={config.x}
        y={config.y + 100}
        width={config.width}
        height={config.height - 120}
        fogState={fog}
        clarity={clarity}
      />

      {/* Nodes rendered as children */}
      {children}
    </g>
  );
}
