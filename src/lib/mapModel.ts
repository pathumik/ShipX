// src/lib/mapModel.ts
// Map UI Data Model - state-space map with regions, fog, and nodes

import type { UncertaintyType, FogState, ConfidenceLevel } from "./types";

export type MapRegionId = UncertaintyType; // "demand" | "feasibility" | "timing"

// Node status for explorer map
export type NodeStatus = 
  | "active"      // Currently being explored
  | "locked"      // Not yet unlocked
  | "completed"   // Successfully completed
  | "validated"   // Validated through evidence
  | "blocked";    // Invalidated or blocked path

// Node types for visual differentiation
export type NodeType = "assumption" | "checkpoint" | "note" | "mission";

// For backward compatibility
export type NodeKind = NodeType;

// Connection between nodes
export interface NodeConnection {
  from: string;
  to: string;
  status: "active" | "abandoned" | "validated";
}

export interface MapNode {
  id: string;                     // Unique stable id (e.g. "demand-01")
  region: MapRegionId;            // demand/feasibility/timing
  label: string;                  // Short label shown on the map
  type: NodeType;                 // assumption/checkpoint/note/mission
  status?: NodeStatus;            // active/locked/completed/validated/blocked
  locked?: boolean;               // Whether node is locked
  
  // Node content
  description?: string;           // Detailed description
  prompt?: string;                // Question or checkpoint prompt
  why_it_matters?: string;        // 1 short sentence (optional)
  
  // Linkages
  risky_assumption_ref?: string;  // Associated assumption text
  mission_name_ref?: string;      // One of approved mission names
  connectedTo?: string[];         // IDs of connected nodes
  
  // UI positioning (percentage 0-100)
  x?: number;
  y?: number;
  
  // User-created indicator
  isUserCreated?: boolean;
  
  // Legacy field for compatibility
  title?: string;
  kind?: NodeKind;
}

// Region in the map
export interface Region {
  id: MapRegionId;
  label: string;                  // "Demand", "Feasibility", "Timing"
  description?: string;           // 1-liner description
  clarity: number;                // 0-100 clarity score
  fog: FogState;                  // high/medium/low
  nodes: MapNode[];               // Nodes in this region
  isPrimary?: boolean;            // true if primary uncertainty
}

// Legacy interface for backward compatibility
export interface MapRegionUI extends Region {
  title?: string;                 // Alias for label
  clarity_score?: number;         // Alias for clarity
  fog_state?: FogState;           // Alias for fog
  is_primary?: boolean;           // Alias for isPrimary
}

// Main map model
export interface UncertaintyMapUIModel {
  map_id: string;
  created_at_iso: string;
  updated_at_iso: string;
  
  // Primary uncertainty
  primary_uncertainty: MapRegionId;
  
  // Three regions
  regions: Record<MapRegionId, Region>;
  
  // Node connections (optional, for path drawing)
  connections?: NodeConnection[];
  
  // Global metrics
  overall_readiness: number;      // 0-100
}

// Helper type for clarity delta calculation
export type ClarityDelta = {
  confidence: ConfidenceLevel;
  delta: number;
};

// Helper function to create a default node
export function createNode(
  id: string,
  region: MapRegionId,
  label: string,
  type: NodeType,
  options?: Partial<MapNode>
): MapNode {
  return {
    id,
    region,
    label,
    type,
    status: "active",
    locked: false,
    isUserCreated: false,
    x: 50,
    y: 50,
    ...options,
  };
}

// Helper function to create a user node
export function createUserNode(
  region: MapRegionId,
  label: string,
  type: NodeType,
  x: number,
  y: number
): MapNode {
  return createNode(
    `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    region,
    label,
    type,
    {
      isUserCreated: true,
      x,
      y,
    }
  );
}

// Calculate fog state from clarity
export function fogFromClarity(clarity: number): FogState {
  if (clarity >= 70) return "low";
  if (clarity >= 40) return "medium";
  return "high";
}
