// src/lib/mapProgress.ts
// Functions to update the map based on mission outcomes

import type { UncertaintyMapUIModel, Region } from "./mapModel";
import type { UncertaintyType, ConfidenceLevel, FogState } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function fogFromClarity(score: number): FogState {
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

export function clarityDelta(confidence: ConfidenceLevel): number {
  if (confidence === "low") return 8;
  if (confidence === "medium") return 20;
  return 35; // high
}

/**
 * Unlock nodes in a region when clarity crosses thresholds
 */
export function unlockNodes(region: Region): Region {
  const score = region.clarity;

  if (score >= 35) {
    return {
      ...region,
      nodes: region.nodes.map((n) =>
        n.locked ? { ...n, locked: false, status: "active" } : n
      ),
    };
  }

  return region;
}

/**
 * Apply a mission outcome to update the map state
 * This is the single function you call when the user logs a result.
 */
export function applyMissionOutcome(params: {
  map: UncertaintyMapUIModel;
  affected_region: UncertaintyType; // usually primary_uncertainty or recommended_next_focus
  evidence_confidence: ConfidenceLevel;
}): UncertaintyMapUIModel {
  const { map, affected_region, evidence_confidence } = params;

  const newMap: UncertaintyMapUIModel = structuredClone(map);
  const region: Region = newMap.regions[affected_region];

  const delta = clarityDelta(evidence_confidence);
  region.clarity = clamp(region.clarity + delta, 0, 100);
  region.fog = fogFromClarity(region.clarity);

  // Unlock region nodes at threshold
  if (region.clarity >= 35) {
    region.nodes = region.nodes.map((n) =>
      n.locked ? { ...n, locked: false, status: "active" } : n
    );
  }

  // Update overall readiness (simple average)
  newMap.overall_readiness =
    (newMap.regions.demand.clarity +
      newMap.regions.feasibility.clarity +
      newMap.regions.timing.clarity) /
    3;

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Mark a specific node as completed
 */
export function markNodeCompleted(
  map: UncertaintyMapUIModel,
  nodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      region.nodes[nodeIndex] = {
        ...region.nodes[nodeIndex],
        status: "completed",
        locked: false,
      };
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Mark a specific node as in progress (active)
 */
export function markNodeInProgress(
  map: UncertaintyMapUIModel,
  nodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      region.nodes[nodeIndex] = {
        ...region.nodes[nodeIndex],
        status: "active",
        locked: false,
      };
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Mark a specific node as validated
 */
export function markNodeValidated(
  map: UncertaintyMapUIModel,
  nodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      region.nodes[nodeIndex] = {
        ...region.nodes[nodeIndex],
        status: "validated",
        locked: false,
      };
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Mark a specific node as blocked
 */
export function markNodeBlocked(
  map: UncertaintyMapUIModel,
  nodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      region.nodes[nodeIndex] = {
        ...region.nodes[nodeIndex],
        status: "blocked",
        locked: false,
      };
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Add a user-created node to a region
 */
export function addUserNode(
  map: UncertaintyMapUIModel,
  regionId: UncertaintyType,
  node: {
    label: string;
    type: "assumption" | "checkpoint" | "note";
    x: number;
    y: number;
    description?: string;
  }
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);
  const region = newMap.regions[regionId];

  const newNode = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    region: regionId,
    label: node.label,
    type: node.type,
    status: "active" as const,
    locked: false,
    isUserCreated: true,
    x: node.x,
    y: node.y,
    description: node.description,
  };

  region.nodes.push(newNode);
  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Remove a user-created node from the map
 */
export function removeUserNode(
  map: UncertaintyMapUIModel,
  nodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex(
      (n) => n.id === nodeId && n.isUserCreated
    );
    if (nodeIndex !== -1) {
      region.nodes.splice(nodeIndex, 1);
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Update node position
 */
export function updateNodePosition(
  map: UncertaintyMapUIModel,
  nodeId: string,
  x: number,
  y: number
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  for (const regionKey of Object.keys(newMap.regions) as UncertaintyType[]) {
    const region = newMap.regions[regionKey];
    const nodeIndex = region.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== -1) {
      region.nodes[nodeIndex] = {
        ...region.nodes[nodeIndex],
        x,
        y,
      };
      break;
    }
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

/**
 * Add a connection between two nodes
 */
export function addNodeConnection(
  map: UncertaintyMapUIModel,
  fromNodeId: string,
  toNodeId: string
): UncertaintyMapUIModel {
  const newMap: UncertaintyMapUIModel = structuredClone(map);

  if (!newMap.connections) {
    newMap.connections = [];
  }

  // Check if connection already exists
  const exists = newMap.connections.some(
    (c) =>
      (c.from === fromNodeId && c.to === toNodeId) ||
      (c.from === toNodeId && c.to === fromNodeId)
  );

  if (!exists) {
    newMap.connections.push({
      from: fromNodeId,
      to: toNodeId,
      status: "active",
    });
  }

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}
