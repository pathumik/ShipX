"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  IdeaStructure,
  UncertaintyClassification,
  MissionProposal,
  MissionLog,
  LearningUpdate,
  TimelineEntry,
} from "@/lib/types";
import type { UncertaintyMapUIModel, NodeType } from "@/lib/mapModel";
import { createDefaultMap } from "@/lib/mapFactory";
import { 
  applyMissionOutcome, 
  addUserNode, 
  removeUserNode,
  updateNodePosition 
} from "@/lib/mapProgress";

// App navigation steps
export type AppStep = "welcome" | "input" | "processing" | "map" | "mission" | "log";

// Session state interface
export interface SessionState {
  session_id: string;
  nickname: string;
  raw_idea_input: string;
  structure?: IdeaStructure;
  classification?: UncertaintyClassification;
  mission?: MissionProposal;
  map?: UncertaintyMapUIModel;
  timeline: TimelineEntry[];
  currentStep: AppStep;
  isWaitlistSaved: boolean;
}

// Initial state
const initialState: SessionState = {
  session_id: "",
  nickname: "",
  raw_idea_input: "",
  timeline: [],
  currentStep: "welcome",
  isWaitlistSaved: false,
};

// Context interface
interface SessionContextType {
  state: SessionState;
  setNickname: (name: string) => void;
  setRawIdeaInput: (input: string) => void;
  setStructure: (structure: IdeaStructure) => void;
  setClassification: (classification: UncertaintyClassification) => void;
  setMission: (mission: MissionProposal) => void;
  initializeMap: () => void;
  logMissionResult: (log: MissionLog, learningUpdate: LearningUpdate) => void;
  setCurrentStep: (step: AppStep) => void;
  setWaitlistSaved: (saved: boolean) => void;
  resetSession: () => void;
  // Node CRUD operations
  addNode: (regionId: "demand" | "feasibility" | "timing", node: { label: string; type: NodeType; x: number; y: number; description?: string }) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = "shipx_session";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SessionState;
        setState(parsed);
      } catch {
        // Invalid stored data, use initial state
        const newSessionId = uuidv4();
        setState({ ...initialState, session_id: newSessionId });
      }
    } else {
      const newSessionId = uuidv4();
      setState({ ...initialState, session_id: newSessionId });
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const setNickname = useCallback((name: string) => {
    setState((prev) => ({ ...prev, nickname: name }));
  }, []);

  const setRawIdeaInput = useCallback((input: string) => {
    setState((prev) => ({ ...prev, raw_idea_input: input }));
  }, []);

  const setStructure = useCallback((structure: IdeaStructure) => {
    setState((prev) => ({ ...prev, structure }));
  }, []);

  const setClassification = useCallback(
    (classification: UncertaintyClassification) => {
      setState((prev) => ({ ...prev, classification }));
    },
    []
  );

  const setMission = useCallback((mission: MissionProposal) => {
    setState((prev) => ({ ...prev, mission }));
  }, []);

  const initializeMap = useCallback(() => {
    setState((prev) => {
      if (!prev.classification || !prev.structure) return prev;

      const map = createDefaultMap({
        map_id: prev.session_id,
        primary_uncertainty: prev.classification.primary_uncertainty,
        risky_assumption: prev.structure.risky_assumption,
      });

      return { ...prev, map };
    });
  }, []);

  const logMissionResult = useCallback(
    (log: MissionLog, learningUpdate: LearningUpdate) => {
      setState((prev) => {
        if (!prev.map || !prev.structure || !prev.classification) return prev;

        // Create timeline entry
        const entry: TimelineEntry = {
          timestamp_iso: new Date().toISOString(),
          risky_assumption: prev.structure.risky_assumption,
          primary_uncertainty: prev.classification.primary_uncertainty,
          mission_name: log.mission_name,
          mission_log: log,
          learning_update: learningUpdate,
        };

        // Update map with mission outcome
        const updatedMap = applyMissionOutcome({
          map: prev.map,
          affected_region: learningUpdate.recommended_next_focus,
          evidence_confidence: learningUpdate.updated_confidence,
        });

        return {
          ...prev,
          map: updatedMap,
          timeline: [...prev.timeline, entry],
        };
      });
    },
    []
  );

  const setCurrentStep = useCallback((step: AppStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setWaitlistSaved = useCallback((saved: boolean) => {
    setState((prev) => ({ ...prev, isWaitlistSaved: saved }));
  }, []);

  const resetSession = useCallback(() => {
    const newSessionId = uuidv4();
    setState({ ...initialState, session_id: newSessionId });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addNode = useCallback(
    (
      regionId: "demand" | "feasibility" | "timing",
      node: { label: string; type: NodeType; x: number; y: number; description?: string }
    ) => {
      setState((prev) => {
        if (!prev.map) return prev;
        const updatedMap = addUserNode(prev.map, regionId, {
          label: node.label,
          type: node.type as "assumption" | "checkpoint" | "note",
          x: node.x,
          y: node.y,
          description: node.description,
        });
        return { ...prev, map: updatedMap };
      });
    },
    []
  );

  const deleteNode = useCallback((nodeId: string) => {
    setState((prev) => {
      if (!prev.map) return prev;
      const updatedMap = removeUserNode(prev.map, nodeId);
      return { ...prev, map: updatedMap };
    });
  }, []);

  const moveNode = useCallback((nodeId: string, x: number, y: number) => {
    setState((prev) => {
      if (!prev.map) return prev;
      const updatedMap = updateNodePosition(prev.map, nodeId, x, y);
      return { ...prev, map: updatedMap };
    });
  }, []);

  // Don't render children until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <SessionContext.Provider
      value={{
        state,
        setNickname,
        setRawIdeaInput,
        setStructure,
        setClassification,
        setMission,
        initializeMap,
        logMissionResult,
        setCurrentStep,
        setWaitlistSaved,
        resetSession,
        addNode,
        deleteNode,
        moveNode,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
