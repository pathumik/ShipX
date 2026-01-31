"use client";

import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ExplorerMap from "@/components/explorer/ExplorerMap";
import SaveJourneyModal from "@/components/SaveJourneyModal";
import Timeline from "@/components/Timeline";

export default function MapPage() {
  const { state, setStructure, setClassification, setMission, initializeMap, setCurrentStep, addNode, deleteNode } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const processIdea = useCallback(async () => {
    if (!state.raw_idea_input || state.map) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Extract structure
      setProcessingStep(1);
      const structureRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call: "structure",
          raw_idea: state.raw_idea_input,
        }),
      });

      if (!structureRes.ok) throw new Error("Failed to extract structure");
      const structureData = await structureRes.json();
      setStructure(structureData.result);

      // Step 2: Classify uncertainty
      setProcessingStep(2);
      const classifyRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call: "classify",
          idea_statement: structureData.result.idea_statement,
          risky_assumption: structureData.result.risky_assumption,
        }),
      });

      if (!classifyRes.ok) throw new Error("Failed to classify uncertainty");
      const classifyData = await classifyRes.json();
      setClassification(classifyData.result);

      // Step 3: Propose mission
      setProcessingStep(3);
      const missionRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call: "mission",
          risky_assumption: structureData.result.risky_assumption,
          primary_uncertainty: classifyData.result.primary_uncertainty,
        }),
      });

      if (!missionRes.ok) throw new Error("Failed to propose mission");
      const missionData = await missionRes.json();
      setMission(missionData.result);

      // Initialize map
      setProcessingStep(4);
      initializeMap();
      setCurrentStep("map");

    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  }, [state.raw_idea_input, state.map, setStructure, setClassification, setMission, initializeMap, setCurrentStep]);

  useEffect(() => {
    // Redirect if no nickname or raw input
    if (!state.nickname) {
      router.push("/");
      return;
    }
    if (!state.raw_idea_input) {
      router.push("/input");
      return;
    }

    // Process idea if not already done
    if (!state.map && !isProcessing) {
      processIdea();
    }
  }, [state.nickname, state.raw_idea_input, state.map, isProcessing, router, processIdea]);

  const handleViewMission = () => {
    setCurrentStep("mission");
    router.push("/mission");
  };

  // Processing state - Blackboard themed loading
  if (isProcessing || !state.map) {
    return (
      <div className="explorer-map-container flex flex-col items-center justify-center p-6">
        <div className="texture-overlay" />
        <div className="vignette-overlay" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            {/* Loading animation */}
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="35" 
                  fill="none" 
                  stroke="#2a2a32" 
                  strokeWidth="2" 
                />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="35" 
                  fill="none" 
                  stroke="#f5c842" 
                  strokeWidth="2" 
                  strokeDasharray="60 160"
                  className="animate-spin"
                  style={{ transformOrigin: '40px 40px', animationDuration: '1.5s' }}
                />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="4" 
                  fill="#f5c842"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#f0f0f0' }}>
              Mapping Your Journey...
            </h2>
            <p className="text-sm" style={{ color: '#6a6a78' }}>
              {processingStep === 1 && "Analyzing your idea..."}
              {processingStep === 2 && "Identifying uncertainties..."}
              {processingStep === 3 && "Planning first mission..."}
              {processingStep === 4 && "Rendering your map..."}
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    step < processingStep
                      ? "bg-[#4ade80]"
                      : step === processingStep
                      ? "bg-[#f5c842] animate-pulse"
                      : "bg-[#2a2a32]"
                  }`}
                />
                <span 
                  className="text-xs mt-2 hidden sm:block"
                  style={{ color: step <= processingStep ? '#9a9aa8' : '#4a4a54' }}
                >
                  {step === 1 && "Extract"}
                  {step === 2 && "Classify"}
                  {step === 3 && "Mission"}
                  {step === 4 && "Map"}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div 
              className="mt-8 p-4 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(229, 69, 69, 0.1)', 
                border: '1px solid rgba(229, 69, 69, 0.3)' 
              }}
            >
              <p className="text-sm mb-3" style={{ color: '#e54545' }}>
                {error}
              </p>
              <button
                onClick={() => {
                  setError(null);
                  processIdea();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-danger"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Timeline view
  if (showTimeline) {
    return (
      <div className="explorer-map-container flex flex-col">
        <div className="texture-overlay" />
        <div className="vignette-overlay" />
        
        {/* Header */}
        <header 
          className="relative z-10 p-4 flex items-center justify-between"
          style={{ 
            borderBottom: '1px solid #2a2a32',
            backgroundColor: '#141418'
          }}
        >
          <div>
            <h1 className="text-lg font-semibold" style={{ color: '#f0f0f0' }}>
              Journey Log
            </h1>
            <p className="text-xs" style={{ color: '#6a6a78' }}>
              {state.timeline.length} entries recorded
            </p>
          </div>
          <button
            onClick={() => setShowTimeline(false)}
            className="px-4 py-2 rounded-lg transition-colors btn-blackboard"
          >
            BACK TO MAP
          </button>
        </header>

        <div className="flex-1 relative z-10 overflow-auto p-4">
          <Timeline entries={state.timeline} />
        </div>
      </div>
    );
  }

  // Main Explorer Map view
  return (
    <div className="explorer-map-container">
      {/* Control buttons overlay */}
      <div className="absolute top-20 left-5 z-50 flex flex-col gap-2">
        <button
          onClick={() => setShowTimeline(true)}
          className="map-control-btn"
          title="Journey Log"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {!state.isWaitlistSaved && (
          <button
            onClick={() => setShowSaveModal(true)}
            className="map-control-btn"
            title="Save Journey"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Explorer Map */}
      <ExplorerMap
        map={state.map}
        mission={state.mission}
        nickname={state.nickname}
        goal={state.structure?.idea_statement}
        onMissionClick={handleViewMission}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
      />

      {/* Idea summary bar */}
      {state.structure && (
        <div 
          className="absolute bottom-0 left-0 right-0 z-40 p-4"
          style={{ 
            backgroundColor: 'rgba(20, 20, 24, 0.95)',
            borderTop: '1px solid #2a2a32',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: '#f5c842' }}>
                Key Assumption to Test
              </p>
              <p className="text-sm truncate" style={{ color: '#f0f0f0' }}>
                {state.structure.risky_assumption}
              </p>
            </div>
            <button
              onClick={handleViewMission}
              className="flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-colors btn-primary"
            >
              START MISSION
            </button>
          </div>
        </div>
      )}

      {/* Save Journey Modal */}
      <SaveJourneyModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
}
