// src/lib/types.ts
// Core TypeScript types for ShipX

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
  mission_name: string; // must match one of allowed mission names in KB
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

// --------------------
// Waitlist Entry
// --------------------
export interface WaitlistEntry {
  id: string; // UUID
  name: string; // User's name
  email: string; // User's email
  idea_summary: string; // Brief idea statement
  primary_uncertainty?: UncertaintyType;
  created_at: string; // ISO timestamp
}

// --------------------
// Mission Names (for type safety)
// --------------------
export const MISSION_NAMES = [
  "Problem Interview",
  "Willingness-to-Act Test",
  "Fake Door Test",
  "Technical / Operational Spike",
  "Expert Reality Check",
  "Channel Constraint Test",
  "Substitute Analysis",
] as const;

export type MissionName = (typeof MISSION_NAMES)[number];
