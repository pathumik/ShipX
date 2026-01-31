Absolutely — here are **TypeScript-ready JSON Schemas + TS types** for every object in your flow. They’re designed to be:

- **Deterministic** (AI outputs must match)

- **Hackathon-simple**
- **Cursor-friendly**
- **Validatable at runtime** (optional but recommended)

I’ll give you:

1. **TypeScript types** (what your app uses)
2. **JSON Schemas** (what you validate AI outputs against)

You can paste this into a file like:

- `src/lib/schemas.ts`

---

# 1) TypeScript Types (v1)

```tsx
// src/lib/types.ts

export type UncertaintyType = "demand" | "feasibility" | "timing";
export type ConfidenceLevel = "low" | "medium" | "high";
export type CompletionStatus = "yes" | "partial" | "no";
export type Decision = "continue" | "pivot" | "pause";
export type FogState = "high" | "medium" | "low";

// --------------------
// AI Call #1
// --------------------
export interface IdeaStructure {
  idea_statement: string;
  risky_assumption: string;
}

// --------------------
// AI Call #2
// --------------------
export interface UncertaintyClassification {
  primary_uncertainty: UncertaintyType;
  classification_reason: string; // one short sentence
}

// --------------------
// AI Call #3
// --------------------
export interface MissionProposal {
  mission_name: string;        // must match one of allowed mission names in KB
  mission_goal: string;
  steps: [string, string, string]; // exactly 3 steps for v1 determinism
  success_signal: string;
  failure_signal: string;
}

// --------------------
// Mission Logging (User input)
// --------------------
export type MissionLog =
  | ProblemInterviewLog
  | WillingnessToActLog
  | FakeDoorLog
  | SpikeLog
  | ExpertRealityCheckLog
  | ChannelConstraintLog
  | SubstituteAnalysisLog;

export interface MissionLogBase {
  mission_name: string;
  completed: CompletionStatus;
  confidence: ConfidenceLevel;
  decision: Decision;
  notes?: string; // optional short note; keep minimal in UI
}

export interface ProblemInterviewLog extends MissionLogBase {
  mission_name: "Problem Interview";
  interviews_count: number; // >= 0
  recurring_problem_observed: boolean;
  pain_intensity: "low" | "medium" | "high";
  strongest_signal?: string;
}

export interface WillingnessToActLog extends MissionLogBase {
  mission_name: "Willingness-to-Act Test";
  exposed_count: number;
  acted_count: number;
  conversion_rate: number; // 0..100 percentage
}

export interface FakeDoorLog extends MissionLogBase {
  mission_name: "Fake Door Test";
  impressions: number;
  clicks: number;
  signups: number;
  dropoff_rate?: number; // 0..100 (optional)
}

export interface SpikeLog extends MissionLogBase {
  mission_name: "Technical / Operational Spike";
  spike_completed: boolean;
  blocker_found: boolean;
  confidence_before: ConfidenceLevel;
  confidence_after: ConfidenceLevel;
}

export interface ExpertRealityCheckLog extends MissionLogBase {
  mission_name: "Expert Reality Check";
  expert_role: string;
  verdict: "possible" | "risky" | "impossible";
  key_warning?: string;
}

export interface ChannelConstraintLog extends MissionLogBase {
  mission_name: "Channel Constraint Test";
  channel_used: string;
  effort_or_cost?: string; // optional free text
  response_rate: number; // 0..100
}

export interface SubstituteAnalysisLog extends MissionLogBase {
  mission_name: "Substitute Analysis";
  main_substitute: string;
  switching_friction: "low" | "medium" | "high";
  must_have_replacement_feature?: string;
}

// --------------------
// AI Call #4
// --------------------
export interface LearningUpdate {
  what_changed: string;
  what_did_not_change: string;
  updated_confidence: ConfidenceLevel;
  recommended_next_focus: UncertaintyType;
}

// --------------------
// AI Call #5 (optional)
// --------------------
export interface MapUpdate {
  new_clarity_score: number; // 0..100
  fog_state: FogState;
}

// --------------------
// Map / Timeline (App state)
// --------------------
export interface RegionState {
  clarity_score: number; // 0..100
  fog_state: FogState;
}

export interface UncertaintyMapState {
  demand: RegionState;
  feasibility: RegionState;
  timing: RegionState;
}

export interface TimelineEntry {
  timestamp_iso: string; // ISO string
  risky_assumption: string;
  primary_uncertainty: UncertaintyType;
  mission_name: string;
  mission_log: MissionLog;
  learning_update: LearningUpdate;
  map_update?: MapUpdate;
}

export interface IdeaSession {
  session_id: string;
  nickname: string;
  raw_idea_input: string;

  structure?: IdeaStructure;
  classification?: UncertaintyClassification;
  mission?: MissionProposal;

  map: UncertaintyMapState;
  timeline: TimelineEntry[];
}

```

---

# 2) JSON Schemas (AI output validation + logs)

Create a file like:

```tsx
// src/lib/jsonSchemas.ts
// These are standard JSON Schema (draft-07 compatible).
// Use Ajv if you want runtime validation (recommended but optional for hackathon).

export const IdeaStructureSchema = {
  type: "object",
  additionalProperties: false,
  required: ["idea_statement", "risky_assumption"],
  properties: {
    idea_statement: { type: "string", minLength: 5, maxLength: 300 },
    risky_assumption: { type: "string", minLength: 5, maxLength: 300 }
  }
} as const;

export const UncertaintyClassificationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["primary_uncertainty", "classification_reason"],
  properties: {
    primary_uncertainty: { enum: ["demand", "feasibility", "timing"] },
    classification_reason: { type: "string", minLength: 3, maxLength: 180 }
  }
} as const;

export const MissionProposalSchema = {
  type: "object",
  additionalProperties: false,
  required: ["mission_name", "mission_goal", "steps", "success_signal", "failure_signal"],
  properties: {
    mission_name: {
      enum: [
        "Problem Interview",
        "Willingness-to-Act Test",
        "Fake Door Test",
        "Technical / Operational Spike",
        "Expert Reality Check",
        "Channel Constraint Test",
        "Substitute Analysis"
      ]
    },
    mission_goal: { type: "string", minLength: 5, maxLength: 240 },
    steps: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string", minLength: 3, maxLength: 160 }
    },
    success_signal: { type: "string", minLength: 3, maxLength: 200 },
    failure_signal: { type: "string", minLength: 3, maxLength: 200 }
  }
} as const;

export const LearningUpdateSchema = {
  type: "object",
  additionalProperties: false,
  required: ["what_changed", "what_did_not_change", "updated_confidence", "recommended_next_focus"],
  properties: {
    what_changed: { type: "string", minLength: 3, maxLength: 260 },
    what_did_not_change: { type: "string", minLength: 3, maxLength: 260 },
    updated_confidence: { enum: ["low", "medium", "high"] },
    recommended_next_focus: { enum: ["demand", "feasibility", "timing"] }
  }
} as const;

export const MapUpdateSchema = {
  type: "object",
  additionalProperties: false,
  required: ["new_clarity_score", "fog_state"],
  properties: {
    new_clarity_score: { type: "number", minimum: 0, maximum: 100 },
    fog_state: { enum: ["high", "medium", "low"] }
  }
} as const;

// ---------------------------
// Mission Log Schemas (user entered)
// ---------------------------

const MissionLogBaseSchema = {
  type: "object",
  required: ["mission_name", "completed", "confidence", "decision"],
  properties: {
    mission_name: { type: "string" },
    completed: { enum: ["yes", "partial", "no"] },
    confidence: { enum: ["low", "medium", "high"] },
    decision: { enum: ["continue", "pivot", "pause"] },
    notes: { type: "string", maxLength: 600 }
  }
} as const;

export const ProblemInterviewLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "interviews_count", "recurring_problem_observed", "pain_intensity"],
      properties: {
        mission_name: { const: "Problem Interview" },
        interviews_count: { type: "number", minimum: 0, maximum: 200 },
        recurring_problem_observed: { type: "boolean" },
        pain_intensity: { enum: ["low", "medium", "high"] },
        strongest_signal: { type: "string", maxLength: 300 }
      }
    }
  ]
} as const;

export const WillingnessToActLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "exposed_count", "acted_count", "conversion_rate"],
      properties: {
        mission_name: { const: "Willingness-to-Act Test" },
        exposed_count: { type: "number", minimum: 0, maximum: 10000000 },
        acted_count: { type: "number", minimum: 0, maximum: 10000000 },
        conversion_rate: { type: "number", minimum: 0, maximum: 100 }
      }
    }
  ]
} as const;

export const FakeDoorLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "impressions", "clicks", "signups"],
      properties: {
        mission_name: { const: "Fake Door Test" },
        impressions: { type: "number", minimum: 0, maximum: 100000000 },
        clicks: { type: "number", minimum: 0, maximum: 100000000 },
        signups: { type: "number", minimum: 0, maximum: 100000000 },
        dropoff_rate: { type: "number", minimum: 0, maximum: 100 }
      }
    }
  ]
} as const;

export const SpikeLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "spike_completed", "blocker_found", "confidence_before", "confidence_after"],
      properties: {
        mission_name: { const: "Technical / Operational Spike" },
        spike_completed: { type: "boolean" },
        blocker_found: { type: "boolean" },
        confidence_before: { enum: ["low", "medium", "high"] },
        confidence_after: { enum: ["low", "medium", "high"] }
      }
    }
  ]
} as const;

export const ExpertRealityCheckLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "expert_role", "verdict"],
      properties: {
        mission_name: { const: "Expert Reality Check" },
        expert_role: { type: "string", minLength: 2, maxLength: 120 },
        verdict: { enum: ["possible", "risky", "impossible"] },
        key_warning: { type: "string", maxLength: 240 }
      }
    }
  ]
} as const;

export const ChannelConstraintLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "channel_used", "response_rate"],
      properties: {
        mission_name: { const: "Channel Constraint Test" },
        channel_used: { type: "string", minLength: 2, maxLength: 120 },
        effort_or_cost: { type: "string", maxLength: 120 },
        response_rate: { type: "number", minimum: 0, maximum: 100 }
      }
    }
  ]
} as const;

export const SubstituteAnalysisLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: ["mission_name", "main_substitute", "switching_friction"],
      properties: {
        mission_name: { const: "Substitute Analysis" },
        main_substitute: { type: "string", minLength: 2, maxLength: 120 },
        switching_friction: { enum: ["low", "medium", "high"] },
        must_have_replacement_feature: { type: "string", maxLength: 120 }
      }
    }
  ]
} as const;

// Helper: pick schema by mission_name (runtime switch)
export const MissionLogSchemasByName = {
  "Problem Interview": ProblemInterviewLogSchema,
  "Willingness-to-Act Test": WillingnessToActLogSchema,
  "Fake Door Test": FakeDoorLogSchema,
  "Technical / Operational Spike": SpikeLogSchema,
  "Expert Reality Check": ExpertRealityCheckLogSchema,
  "Channel Constraint Test": ChannelConstraintLogSchema,
  "Substitute Analysis": SubstituteAnalysisLogSchema
} as const;

```

---

# Optional: Ajv Runtime Validation (highly recommended)

If you want to guarantee AI output never breaks your UI, add:

```bash
npm i ajv

```

Then validate like:

```tsx
import Ajv from "ajv";
import { MissionProposalSchema } from "./jsonSchemas";

const ajv = new Ajv({ allErrors: true });
const validateMission = ajv.compile(MissionProposalSchema);

export function assertValidMission(data: unknown) {
  const ok = validateMission(data);
  if (!ok) {
    throw new Error("Invalid MissionProposal: " + ajv.errorsText(validateMission.errors));
  }
  return data;
}

```

---

# What you should do next

Now we should lock the **Map UI Data Model** (super simple):

- region layout
- fog overlay rules
- clarity increment rules
- timeline binding

Say: **“Map UI data model next”** and I’ll write it in the same TS-ready style.