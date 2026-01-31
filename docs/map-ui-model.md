Great — here’s a **TS-ready Map UI data model** that’s simple enough to build fast, but structured enough to evolve into your future “journey world” concept.

This is **not** a Google Map. It’s a **state-space map**: regions + fog + nodes + progression.

You can paste this into:

- `src/lib/mapModel.ts`

---

# Map UI Data Model (TypeScript-ready)

## 0) Design goals (v1)

- **3 Regions** (Demand / Feasibility / Timing)
- Each region has **clarity + fog**
- Each region contains **a few nodes** (assumptions / checkpoints)
- Nodes can be **locked/unlocked/completed**
- Map supports **click → view mission → log outcome → update map**
- Works with **very simple UI**: cards + overlays + progress bars
- Later can become: terrain, worlds, journey visuals

---

## 1) Core Types

```tsx
// src/lib/mapModel.ts
import type { UncertaintyType, FogState, ConfidenceLevel } from "./types";

export type MapRegionId = UncertaintyType; // "demand" | "feasibility" | "timing"

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";

// Minimal node category for v1 (optional but useful for UI labels)
export type NodeKind = "assumption" | "checkpoint" | "mission";

export interface MapNode {
  id: string;                 // unique stable id (e.g. "demand-01")
  region: MapRegionId;        // demand/feasibility/timing
  title: string;              // short label shown on the map
  kind: NodeKind;             // assumption/checkpoint/mission
  status: NodeStatus;         // locked/available/in_progress/completed

  // What this node represents (the "fogged question" or checkpoint)
  prompt?: string;            // e.g. "Will users take action to get this?"
  why_it_matters?: string;    // 1 short sentence (optional)

  // Optional linkage to a mission or assumption text
  risky_assumption_ref?: string; // can store a short assumption snippet
  mission_name_ref?: string;     // one of approved mission names

  // UI positioning (so you can render nodes visually if you want)
  // If you keep it card-based, you can ignore x/y.
  x?: number; // 0..100 (percentage)
  y?: number; // 0..100 (percentage)
}

export interface MapRegionUI {
  id: MapRegionId;
  title: string;              // "Demand", "Feasibility", "Timing"
  description: string;        // 1-liner
  clarity_score: number;      // 0..100
  fog_state: FogState;        // high/medium/low

  // Region can contain nodes
  nodes: MapNode[];

  // Optional: "recommended next" highlight
  is_primary?: boolean;       // true if primary uncertainty
}

export interface UncertaintyMapUIModel {
  map_id: string;             // stable id per idea/session
  created_at_iso: string;
  updated_at_iso: string;

  // Primary uncertainty influences highlights and default open region
  primary_uncertainty: MapRegionId;

  // The 3 core regions
  regions: Record<MapRegionId, MapRegionUI>;

  // Global progression metrics (v1 simple)
  overall_readiness: number;  // 0..100
}

```

---

## 2) Default Map Factory (v1)

This function builds a new map immediately after AI Call #2/#3.

```tsx
// src/lib/mapFactory.ts
import type { UncertaintyType } from "./types";
import type { UncertaintyMapUIModel, MapRegionUI } from "./mapModel";

function nowIso() {
  return new Date().toISOString();
}

function fogFromClarity(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

function regionBase(
  id: UncertaintyType,
  title: string,
  description: string,
  clarity_score: number,
  is_primary: boolean
): MapRegionUI {
  return {
    id,
    title,
    description,
    clarity_score,
    fog_state: fogFromClarity(clarity_score),
    nodes: [],
    is_primary
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

  const demand = regionBase(
    "demand",
    "Demand",
    "Do people care enough to act?",
    primary_uncertainty === "demand" ? basePrimary : baseOther,
    primary_uncertainty === "demand"
  );

  const feasibility = regionBase(
    "feasibility",
    "Feasibility",
    "Can this be delivered reliably?",
    primary_uncertainty === "feasibility" ? basePrimary : baseOther,
    primary_uncertainty === "feasibility"
  );

  const timing = regionBase(
    "timing",
    "Timing",
    "Is now the right moment and channel?",
    primary_uncertainty === "timing" ? basePrimary : baseOther,
    primary_uncertainty === "timing"
  );

  // Add 2–3 starter nodes per region (lightweight + generic)
  demand.nodes = [
    {
      id: "demand-01",
      region: "demand",
      title: "Real Need",
      kind: "assumption",
      status: "available",
      prompt: "Does the target group feel this problem strongly?",
      why_it_matters: "If not, adoption will be weak.",
      risky_assumption_ref: risky_assumption,
      x: 20,
      y: 30
    },
    {
      id: "demand-02",
      region: "demand",
      title: "Willingness to Act",
      kind: "checkpoint",
      status: "locked",
      prompt: "Will they take a real action (signup/call/commitment)?",
      why_it_matters: "Interest without action is not demand.",
      x: 60,
      y: 45
    }
  ];

  feasibility.nodes = [
    {
      id: "feasibility-01",
      region: "feasibility",
      title: "Hard Part Works",
      kind: "assumption",
      status: "available",
      prompt: "Can the hardest part work in practice?",
      why_it_matters: "If not, execution will stall.",
      risky_assumption_ref: risky_assumption,
      x: 25,
      y: 55
    },
    {
      id: "feasibility-02",
      region: "feasibility",
      title: "Expert Verdict",
      kind: "checkpoint",
      status: "locked",
      prompt: "Would an expert call this feasible and safe?",
      why_it_matters: "Experts can reveal hidden blockers.",
      x: 65,
      y: 65
    }
  ];

  timing.nodes = [
    {
      id: "timing-01",
      region: "timing",
      title: "Channel Reality",
      kind: "assumption",
      status: "available",
      prompt: "Can you reach users through the intended channel?",
      why_it_matters: "Great ideas fail with impossible distribution.",
      risky_assumption_ref: risky_assumption,
      x: 30,
      y: 75
    },
    {
      id: "timing-02",
      region: "timing",
      title: "Substitutes",
      kind: "checkpoint",
      status: "locked",
      prompt: "What would users replace to adopt this?",
      why_it_matters: "Switching is the real cost.",
      x: 70,
      y: 80
    }
  ];

  const regions = { demand, feasibility, timing };

  // simple overall readiness: average clarity
  const overall_readiness =
    (regions.demand.clarity_score +
      regions.feasibility.clarity_score +
      regions.timing.clarity_score) /
    3;

  return {
    map_id,
    created_at_iso: nowIso(),
    updated_at_iso: nowIso(),
    primary_uncertainty,
    regions,
    overall_readiness
  };
}

```

---

## 3) Map Progression Rules (v1)

Keep progression deterministic and easy to explain.

### Rule A — clarity updates by evidence confidence

Use your AI Call #5 output if you implement it; otherwise do a local rule:

```tsx
export function clarityDelta(confidence: ConfidenceLevel): number {
  if (confidence === "low") return 8;
  if (confidence === "medium") return 20;
  return 35; // high
}

```

### Rule B — fog updates from clarity score

Already defined:

- 0–34 → high fog
- 35–69 → medium fog
- 70–100 → low fog

### Rule C — node unlocking (simple gating)

When a region clarity crosses thresholds:

- at **>= 35**: unlock node #2 in that region
- at **>= 70**: mark region “mostly clear”

```tsx
export function unlockNodes(region: MapRegionUI) {
  const score = region.clarity_score;

  if (score >= 35) {
    region.nodes = region.nodes.map((n) =>
      n.status === "locked" ? { ...n, status: "available" } : n
    );
  }

  if (score >= 70) {
    // optional: mark first node completed if any mission logged
    // keep minimal for hackathon; you can leave this out.
  }
}

```

---

## 4) Map Update Function (after each logged mission)

This is the single function you call when the user logs a result.

```tsx
import type { UncertaintyMapUIModel, MapRegionUI } from "./mapModel";
import type { UncertaintyType, ConfidenceLevel } from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fogFromClarity(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "low";
  if (score >= 35) return "medium";
  return "high";
}

function deltaFromConfidence(conf: ConfidenceLevel): number {
  if (conf === "low") return 8;
  if (conf === "medium") return 20;
  return 35;
}

export function applyMissionOutcome(params: {
  map: UncertaintyMapUIModel;
  affected_region: UncertaintyType;   // usually primary_uncertainty or recommended_next_focus
  evidence_confidence: ConfidenceLevel;
}): UncertaintyMapUIModel {
  const { map, affected_region, evidence_confidence } = params;

  const newMap: UncertaintyMapUIModel = structuredClone(map);
  const region: MapRegionUI = newMap.regions[affected_region];

  const delta = deltaFromConfidence(evidence_confidence);
  region.clarity_score = clamp(region.clarity_score + delta, 0, 100);
  region.fog_state = fogFromClarity(region.clarity_score);

  // Unlock region nodes at threshold
  if (region.clarity_score >= 35) {
    region.nodes = region.nodes.map((n) =>
      n.status === "locked" ? { ...n, status: "available" } : n
    );
  }

  // Update overall readiness (simple average)
  newMap.overall_readiness =
    (newMap.regions.demand.clarity_score +
      newMap.regions.feasibility.clarity_score +
      newMap.regions.timing.clarity_score) /
    3;

  newMap.updated_at_iso = new Date().toISOString();
  return newMap;
}

```

---

## 5) Minimal UI binding model (what your components need)

This is the “UI contract”:

- **MapScreen**
    - reads `map.regions`
    - highlights `primary_uncertainty`
    - shows `overall_readiness`
- **RegionPanel**
    - shows region title, description, clarity bar, fog overlay
    - lists nodes
- **NodeModal (optional)**
    - shows node prompt + why_it_matters
    - button: “Get mission”
- **MissionScreen**
    - show mission steps
    - button: “Log result”
- **ResultForm**
    - mission-specific fields
    - on submit: call AI #4 (+ optional AI #5)
    - then `applyMissionOutcome()`
    - append timeline entry

---

# What to implement for hackathon (only these)

✅ Regions with fog + clarity

✅ Node list (cards)

✅ Click node → show mission → log result

✅ Map updates + timeline

That alone is a winning demo.

---

## Next step

If you want, next we do the **Cursor Build Checklist** in a very strict sequence:

- file list
- exact tasks
- copy-paste prompts to Cursor per step
- no wasted time

Just say: **“Cursor checklist next.”**