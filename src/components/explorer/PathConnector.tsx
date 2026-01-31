"use client";

import type { NodeConnection } from "@/lib/mapModel";

interface PathConnectorProps {
  connection: NodeConnection;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isAnimating?: boolean;
}

export default function PathConnector({
  connection,
  fromX,
  fromY,
  toX,
  toY,
  isAnimating = false,
}: PathConnectorProps) {
  // Calculate control points for a curved path
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  
  // Add some curve to the path
  const dx = toX - fromX;
  const dy = toY - fromY;
  const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
  
  // Control point perpendicular to the line
  const controlX = midX + (dy > 0 ? offset : -offset);
  const controlY = midY + (dx > 0 ? -offset : offset);
  
  // Create path
  const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  // Get styles based on connection status
  const getPathStyles = () => {
    switch (connection.status) {
      case "validated":
        return {
          stroke: "#3a6b3a",
          strokeWidth: 2.5,
          strokeDasharray: "none",
          opacity: 1,
        };
      case "abandoned":
        return {
          stroke: "#8b3a3a",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          opacity: 0.5,
        };
      case "active":
      default:
        return {
          stroke: "#2c2416",
          strokeWidth: 2,
          strokeDasharray: "8 4",
          opacity: 0.8,
        };
    }
  };

  const styles = getPathStyles();

  return (
    <g className="path-connector">
      {/* Shadow/glow effect for validated paths */}
      {connection.status === "validated" && (
        <path
          d={pathD}
          fill="none"
          stroke="#3a6b3a"
          strokeWidth={6}
          opacity={0.2}
          strokeLinecap="round"
        />
      )}
      
      {/* Main path */}
      <path
        d={pathD}
        fill="none"
        stroke={styles.stroke}
        strokeWidth={styles.strokeWidth}
        strokeDasharray={styles.strokeDasharray}
        opacity={styles.opacity}
        strokeLinecap="round"
        className={isAnimating ? "path-drawing" : ""}
      />

      {/* Arrow at the end */}
      <g transform={`translate(${toX}, ${toY}) rotate(${Math.atan2(toY - controlY, toX - controlX) * 180 / Math.PI})`}>
        <polygon
          points="-8,-4 0,0 -8,4"
          fill={styles.stroke}
          opacity={styles.opacity}
        />
      </g>
    </g>
  );
}

// Helper component to render all connections
interface PathConnectorGroupProps {
  connections: NodeConnection[];
  nodePositions: Record<string, { x: number; y: number }>;
}

export function PathConnectorGroup({ connections, nodePositions }: PathConnectorGroupProps) {
  return (
    <g className="path-connectors">
      {connections.map((connection, idx) => {
        const fromPos = nodePositions[connection.from];
        const toPos = nodePositions[connection.to];
        
        if (!fromPos || !toPos) return null;
        
        return (
          <PathConnector
            key={`${connection.from}-${connection.to}-${idx}`}
            connection={connection}
            fromX={fromPos.x}
            fromY={fromPos.y}
            toX={toPos.x}
            toY={toPos.y}
          />
        );
      })}
    </g>
  );
}
