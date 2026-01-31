// src/lib/mapFactory.ts
// Factory function to create a new uncertainty map after AI classification

import type { UncertaintyType, FogState } from "./types";
import type { UncertaintyMapUIModel, Region, MapNode } from "./mapModel";

function nowIso(): string {
  return new Date().toISOString();
}

function fogFromClarity(score: number): FogState {
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

function createRegion(
  id: UncertaintyType,
  label: string,
  description: string,
  clarity: number,
  isPrimary: boolean
): Region {
  return {
    id,
    label,
    description,
    clarity,
    fog: fogFromClarity(clarity),
    nodes: [],
    isPrimary,
  };
}

export function createDefaultMap(params: {
  map_id: string;
  primary_uncertainty: UncertaintyType;
  risky_assumption: string;
}): UncertaintyMapUIModel {
  const { map_id, primary_uncertainty, risky_assumption } = params;

  // Start slightly higher in the primary region to make the map feel "shaped"
  const basePrimary = 20;
  const baseOther = 10;

  const demand = createRegion(
    "demand",
    "Demand",
    "Do people care enough to act?",
    primary_uncertainty === "demand" ? basePrimary : baseOther,
    primary_uncertainty === "demand"
  );

  const feasibility = createRegion(
    "feasibility",
    "Feasibility",
    "Can this be delivered reliably?",
    primary_uncertainty === "feasibility" ? basePrimary : baseOther,
    primary_uncertainty === "feasibility"
  );

  const timing = createRegion(
    "timing",
    "Timing",
    "Is now the right moment and channel?",
    primary_uncertainty === "timing" ? basePrimary : baseOther,
    primary_uncertainty === "timing"
  );

  // Add starter nodes per region
  demand.nodes = [
    {
      id: "demand-01",
      region: "demand",
      label: "Real Need",
      type: "assumption",
      status: "active",
      locked: false,
      prompt: "Does the target group feel this problem strongly?",
      description: "If not, adoption will be weak.",
      why_it_matters: "If not, adoption will be weak.",
      risky_assumption_ref: risky_assumption,
      x: 30,
      y: 25,
    } as MapNode,
    {
      id: "demand-02",
      region: "demand",
      label: "Willingness to Act",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "Will they take a real action (signup/call/commitment)?",
      description: "Interest without action is not demand.",
      why_it_matters: "Interest without action is not demand.",
      x: 70,
      y: 50,
    } as MapNode,
    {
      id: "demand-03",
      region: "demand",
      label: "Payment Intent",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "Would they pay or commit resources?",
      description: "True demand shows in resource commitment.",
      why_it_matters: "True demand shows in resource commitment.",
      x: 50,
      y: 75,
    } as MapNode,
  ];

  feasibility.nodes = [
    {
      id: "feasibility-01",
      region: "feasibility",
      label: "Hard Part Works",
      type: "assumption",
      status: "active",
      locked: false,
      prompt: "Can the hardest part work in practice?",
      description: "If not, execution will stall.",
      why_it_matters: "If not, execution will stall.",
      risky_assumption_ref: risky_assumption,
      x: 35,
      y: 30,
    } as MapNode,
    {
      id: "feasibility-02",
      region: "feasibility",
      label: "Expert Verdict",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "Would an expert call this feasible and safe?",
      description: "Experts can reveal hidden blockers.",
      why_it_matters: "Experts can reveal hidden blockers.",
      x: 65,
      y: 55,
    } as MapNode,
    {
      id: "feasibility-03",
      region: "feasibility",
      label: "Resource Reality",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "Do you have the resources to execute?",
      description: "Ideas need fuel to become real.",
      why_it_matters: "Ideas need fuel to become real.",
      x: 45,
      y: 80,
    } as MapNode,
  ];

  timing.nodes = [
    {
      id: "timing-01",
      region: "timing",
      label: "Channel Reality",
      type: "assumption",
      status: "active",
      locked: false,
      prompt: "Can you reach users through the intended channel?",
      description: "Great ideas fail with impossible distribution.",
      why_it_matters: "Great ideas fail with impossible distribution.",
      risky_assumption_ref: risky_assumption,
      x: 40,
      y: 28,
    } as MapNode,
    {
      id: "timing-02",
      region: "timing",
      label: "Substitutes",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "What would users replace to adopt this?",
      description: "Switching is the real cost.",
      why_it_matters: "Switching is the real cost.",
      x: 60,
      y: 52,
    } as MapNode,
    {
      id: "timing-03",
      region: "timing",
      label: "Market Timing",
      type: "checkpoint",
      status: "locked",
      locked: true,
      prompt: "Is the market ready for this now?",
      description: "Too early or too late kills good ideas.",
      why_it_matters: "Too early or too late kills good ideas.",
      x: 50,
      y: 78,
    } as MapNode,
  ];

  const regions = { demand, feasibility, timing };

  // Simple overall readiness: average clarity
  const overall_readiness =
    (regions.demand.clarity +
      regions.feasibility.clarity +
      regions.timing.clarity) /
    3;

  return {
    map_id,
    created_at_iso: nowIso(),
    updated_at_iso: nowIso(),
    primary_uncertainty,
    regions,
    connections: [],
    overall_readiness,
  };
}
