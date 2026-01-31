"use client";

import type { MapNode } from "@/lib/mapModel";

interface MapNodeProps {
  node: MapNode;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}

// Minimal symbol definitions - placed on the map like marks
const NodeSymbols = {
  // Simple filled dot for checkpoints
  checkpoint: (
    <circle
      cx="0"
      cy="0"
      r="6"
      className="node-symbol"
    />
  ),
  // Diamond for completed/validated
  completed: (
    <rect
      x="-6"
      y="-6"
      width="12"
      height="12"
      transform="rotate(45)"
      className="node-symbol"
    />
  ),
  // X mark for blocked
  blocked: (
    <g className="node-symbol">
      <line x1="-6" y1="-6" x2="6" y2="6" strokeWidth="2.5" />
      <line x1="6" y1="-6" x2="-6" y2="6" strokeWidth="2.5" />
    </g>
  ),
  // Small flag for assumptions (critical questions)
  assumption: (
    <g className="node-symbol">
      <line x1="0" y1="-8" x2="0" y2="8" strokeWidth="2" />
      <path d="M0 -8 L10 -4 L0 0" fill="currentColor" strokeWidth="0" />
    </g>
  ),
  // Star for validated assumptions
  validated: (
    <polygon
      points="0,-8 2,-3 8,-3 4,1 6,7 0,4 -6,7 -4,1 -8,-3 -2,-3"
      className="node-symbol"
    />
  ),
  // Dotted circle for locked/unavailable
  locked: (
    <circle
      cx="0"
      cy="0"
      r="6"
      className="node-symbol"
      fill="none"
      strokeDasharray="2 2"
    />
  ),
  // Circle with question mark for unknown
  unknown: (
    <g className="node-symbol">
      <circle cx="0" cy="0" r="8" fill="none" strokeWidth="1.5" />
      <text
        x="0"
        y="4"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
      >
        ?
      </text>
    </g>
  ),
};

// Semantic color mapping based on node state
function getNodeColor(node: MapNode): string {
  // Status-based colors first
  if (node.status === "blocked") return "#e54545"; // Red - risk
  if (node.status === "validated" || node.status === "completed") return "#4ade80"; // Green - progress
  if (node.locked) return "#3a3a42"; // Muted
  
  // Type-based colors
  switch (node.type) {
    case "assumption":
      return "#e54545"; // Red - assumptions are risks until validated
    case "checkpoint":
      return "#60a5fa"; // Blue - evidence points
    default:
      return "#f0f0f0"; // White - structure
  }
}

// Get the appropriate symbol based on node state
function getNodeSymbol(node: MapNode): keyof typeof NodeSymbols {
  if (node.status === "blocked") return "blocked";
  if (node.status === "validated") return "validated";
  if (node.status === "completed") return "completed";
  if (node.locked) return "locked";
  
  switch (node.type) {
    case "assumption":
      return "assumption";
    case "checkpoint":
      return "checkpoint";
    default:
      return "unknown";
  }
}

// Helper to get node label (handles both old 'title' and new 'label' properties)
function getNodeLabel(node: MapNode): string {
  return node.label || (node as unknown as { title?: string }).title || node.id || "Node";
}

export default function MapNodeComponent({
  node,
  x,
  y,
  isSelected,
  onClick,
}: MapNodeProps) {
  const nodeLabel = getNodeLabel(node);
  const color = getNodeColor(node);
  const symbolType = getNodeSymbol(node);
  const symbol = NodeSymbols[symbolType];

  const nodeClasses = [
    "map-node",
    `node-${node.type}`,
    node.status ? `node-${node.status}` : "",
    node.locked ? "node-locked" : "",
    node.isUserCreated ? "node-user-created" : "",
    isSelected ? "selected" : "",
  ].filter(Boolean).join(" ");

  return (
    <g
      className={nodeClasses}
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation();
        if (!node.locked) {
          onClick();
        }
      }}
      style={{ 
        color,
        cursor: node.locked ? "not-allowed" : "pointer",
      }}
    >
      {/* Selection glow - yellow focus */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="16"
          fill="rgba(245, 200, 66, 0.15)"
          stroke="#f5c842"
          strokeWidth="1"
          className="node-highlight"
        />
      )}

      {/* Main symbol */}
      <g 
        style={{ 
          stroke: color, 
          fill: symbolType === "assumption" || symbolType === "blocked" || symbolType === "locked" || symbolType === "unknown" 
            ? "none" 
            : color 
        }}
      >
        {symbol}
      </g>

      {/* Label - positioned below */}
      <text
        x="0"
        y="20"
        className="node-label"
        fill="#9a9aa8"
        fontSize="10"
        fontWeight="500"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {nodeLabel.length > 18 ? nodeLabel.slice(0, 16) + "…" : nodeLabel}
      </text>

      {/* Lock indicator - small icon */}
      {node.locked && (
        <g transform="translate(10, -10)">
          <circle cx="0" cy="0" r="6" fill="#141418" stroke="#3a3a42" strokeWidth="1" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="7"
            fill="#6a6a78"
          >
            🔒
          </text>
        </g>
      )}

      {/* Status indicator dot - top right */}
      {node.status && node.status !== "active" && !isSelected && (
        <circle
          cx="8"
          cy="-8"
          r="3"
          fill={
            node.status === "validated" || node.status === "completed"
              ? "#4ade80"
              : node.status === "blocked"
              ? "#e54545"
              : "#60a5fa"
          }
        />
      )}

      {/* User-created indicator */}
      {node.isUserCreated && (
        <text
          x="10"
          y="8"
          fontSize="8"
          fill="#6a6a78"
        >
          ✎
        </text>
      )}
    </g>
  );
}
