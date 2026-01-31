"use client";

import type { MapNode } from "@/lib/mapModel";

interface MapNodeProps {
  node: MapNode;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}

// Node symbol SVG paths based on type
const NodeSymbols = {
  // Flag shape for assumptions
  assumption: (
    <path
      d="M0 -12 L0 12 M0 -12 L12 -6 L0 0"
      className="node-symbol"
      fill="none"
      strokeWidth="2"
    />
  ),
  // Filled circle for checkpoints
  checkpoint: (
    <circle
      cx="0"
      cy="0"
      r="8"
      className="node-symbol"
    />
  ),
  // Diamond for completed
  completed: (
    <rect
      x="-8"
      y="-8"
      width="16"
      height="16"
      transform="rotate(45)"
      className="node-symbol"
    />
  ),
  // X mark for blocked/invalidated
  blocked: (
    <g className="node-symbol">
      <line x1="-8" y1="-8" x2="8" y2="8" strokeWidth="3" />
      <line x1="8" y1="-8" x2="-8" y2="8" strokeWidth="3" />
    </g>
  ),
  // Star for validated
  validated: (
    <polygon
      points="0,-10 3,-4 10,-4 5,1 7,8 0,4 -7,8 -5,1 -10,-4 -3,-4"
      className="node-symbol"
    />
  ),
  // Dotted circle for locked
  locked: (
    <circle
      cx="0"
      cy="0"
      r="8"
      className="node-symbol"
      fill="none"
      strokeDasharray="3 3"
    />
  ),
  // Question mark for unknown
  unknown: (
    <g className="node-symbol">
      <circle cx="0" cy="0" r="10" fill="none" strokeWidth="2" />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="currentColor"
      >
        ?
      </text>
    </g>
  ),
};

// Get stroke color based on node type and status
function getNodeColor(node: MapNode): string {
  if (node.status === "blocked") return "#8b3a3a"; // Red
  if (node.status === "validated") return "#3a6b3a"; // Green
  if (node.status === "completed") return "#3a6b3a"; // Green
  if (node.locked) return "#8b7355"; // Aged brown
  
  // Based on type
  switch (node.type) {
    case "assumption":
      return "#8b3a3a"; // Red ink
    case "checkpoint":
      return "#3a5a8b"; // Blue ink
    default:
      return "#2c2416"; // Black ink
  }
}

// Get the appropriate symbol for the node
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
      filter="url(#nodeShadow)"
    >
      {/* Background glow for selected state */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="18"
          fill={color}
          opacity="0.2"
        />
      )}

      {/* Main symbol */}
      <g style={{ stroke: color, fill: symbolType === "assumption" || symbolType === "blocked" || symbolType === "locked" ? "none" : color }}>
        {symbol}
      </g>

      {/* Selection ring */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="4 2"
          className="node-highlight"
        />
      )}

      {/* Label */}
      <text
        x="0"
        y="24"
        className="node-label"
        style={{ fontFamily: "var(--font-annotation)" }}
      >
        {nodeLabel.length > 20 ? nodeLabel.slice(0, 18) + "..." : nodeLabel}
      </text>

      {/* Lock indicator */}
      {node.locked && (
        <g transform="translate(12, -12)">
          <rect x="-5" y="-5" width="10" height="10" fill="#f4e4c1" rx="2" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fill="#8b7355"
          >
            🔒
          </text>
        </g>
      )}

      {/* Status indicator dot */}
      {node.status && node.status !== "active" && (
        <circle
          cx="10"
          cy="-10"
          r="4"
          fill={
            node.status === "validated" || node.status === "completed"
              ? "#3a6b3a"
              : node.status === "blocked"
              ? "#8b3a3a"
              : "#3a5a8b"
          }
        />
      )}
    </g>
  );
}
