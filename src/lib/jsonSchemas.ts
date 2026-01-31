// src/lib/jsonSchemas.ts
// JSON Schemas for AI output validation (draft-07 compatible)
// Use Ajv for runtime validation

export const IdeaStructureSchema = {
  type: "object",
  additionalProperties: false,
  required: ["idea_statement", "risky_assumption"],
  properties: {
    idea_statement: { type: "string", minLength: 5, maxLength: 300 },
    risky_assumption: { type: "string", minLength: 5, maxLength: 300 },
  },
} as const;

export const UncertaintyClassificationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["primary_uncertainty", "classification_reason"],
  properties: {
    primary_uncertainty: { enum: ["demand", "feasibility", "timing"] },
    classification_reason: { type: "string", minLength: 3, maxLength: 180 },
  },
} as const;

export const MissionProposalSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "mission_name",
    "mission_goal",
    "steps",
    "success_signal",
    "failure_signal",
  ],
  properties: {
    mission_name: {
      enum: [
        "Problem Interview",
        "Willingness-to-Act Test",
        "Fake Door Test",
        "Technical / Operational Spike",
        "Expert Reality Check",
        "Channel Constraint Test",
        "Substitute Analysis",
      ],
    },
    mission_goal: { type: "string", minLength: 5, maxLength: 240 },
    steps: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string", minLength: 3, maxLength: 160 },
    },
    success_signal: { type: "string", minLength: 3, maxLength: 200 },
    failure_signal: { type: "string", minLength: 3, maxLength: 200 },
  },
} as const;

export const LearningUpdateSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "what_changed",
    "what_did_not_change",
    "updated_confidence",
    "recommended_next_focus",
  ],
  properties: {
    what_changed: { type: "string", minLength: 3, maxLength: 260 },
    what_did_not_change: { type: "string", minLength: 3, maxLength: 260 },
    updated_confidence: { enum: ["low", "medium", "high"] },
    recommended_next_focus: { enum: ["demand", "feasibility", "timing"] },
  },
} as const;

export const MapUpdateSchema = {
  type: "object",
  additionalProperties: false,
  required: ["new_clarity_score", "fog_state"],
  properties: {
    new_clarity_score: { type: "number", minimum: 0, maximum: 100 },
    fog_state: { enum: ["high", "medium", "low"] },
  },
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
    notes: { type: "string", maxLength: 600 },
  },
} as const;

export const ProblemInterviewLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: [
        "mission_name",
        "interviews_count",
        "recurring_problem_observed",
        "pain_intensity",
      ],
      properties: {
        mission_name: { const: "Problem Interview" },
        interviews_count: { type: "number", minimum: 0, maximum: 200 },
        recurring_problem_observed: { type: "boolean" },
        pain_intensity: { enum: ["low", "medium", "high"] },
        strongest_signal: { type: "string", maxLength: 300 },
      },
    },
  ],
} as const;

export const WillingnessToActLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: [
        "mission_name",
        "exposed_count",
        "acted_count",
        "conversion_rate",
      ],
      properties: {
        mission_name: { const: "Willingness-to-Act Test" },
        exposed_count: { type: "number", minimum: 0, maximum: 10000000 },
        acted_count: { type: "number", minimum: 0, maximum: 10000000 },
        conversion_rate: { type: "number", minimum: 0, maximum: 100 },
      },
    },
  ],
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
        dropoff_rate: { type: "number", minimum: 0, maximum: 100 },
      },
    },
  ],
} as const;

export const SpikeLogSchema = {
  allOf: [
    MissionLogBaseSchema,
    {
      type: "object",
      additionalProperties: false,
      required: [
        "mission_name",
        "spike_completed",
        "blocker_found",
        "confidence_before",
        "confidence_after",
      ],
      properties: {
        mission_name: { const: "Technical / Operational Spike" },
        spike_completed: { type: "boolean" },
        blocker_found: { type: "boolean" },
        confidence_before: { enum: ["low", "medium", "high"] },
        confidence_after: { enum: ["low", "medium", "high"] },
      },
    },
  ],
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
        key_warning: { type: "string", maxLength: 240 },
      },
    },
  ],
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
        response_rate: { type: "number", minimum: 0, maximum: 100 },
      },
    },
  ],
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
        must_have_replacement_feature: { type: "string", maxLength: 120 },
      },
    },
  ],
} as const;

// Helper: pick schema by mission_name (runtime switch)
export const MissionLogSchemasByName = {
  "Problem Interview": ProblemInterviewLogSchema,
  "Willingness-to-Act Test": WillingnessToActLogSchema,
  "Fake Door Test": FakeDoorLogSchema,
  "Technical / Operational Spike": SpikeLogSchema,
  "Expert Reality Check": ExpertRealityCheckLogSchema,
  "Channel Constraint Test": ChannelConstraintLogSchema,
  "Substitute Analysis": SubstituteAnalysisLogSchema,
} as const;
