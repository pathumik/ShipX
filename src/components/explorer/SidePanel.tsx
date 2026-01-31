"use client";

import type { MapNode, Region, NodeType } from "@/lib/mapModel";
import type { MissionProposal } from "@/lib/types";
import { useRouter } from "next/navigation";
import NodeEditor from "./NodeEditor";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "node" | "mission" | "region" | "add";
  selectedNode: MapNode | null;
  selectedRegion: Region | null;
  mission?: MissionProposal;
  addNodeRegion?: "demand" | "feasibility" | "timing" | null;
  onSaveNewNode?: (data: { label: string; type: NodeType; description?: string }) => void;
  onDeleteNode?: () => void;
  onAddNodeToRegion?: (regionId: "demand" | "feasibility" | "timing") => void;
}

export default function SidePanel({
  isOpen,
  onClose,
  mode,
  selectedNode,
  selectedRegion,
  mission,
  addNodeRegion,
  onSaveNewNode,
  onDeleteNode,
  onAddNodeToRegion,
}: SidePanelProps) {
  const router = useRouter();

  const handleStartMission = () => {
    router.push("/mission");
  };

  // Render content based on mode
  const renderContent = () => {
    switch (mode) {
      case "node":
        return selectedNode ? (
          <NodeDetail node={selectedNode} onDelete={onDeleteNode} />
        ) : (
          <EmptyState message="Select a node to view details" />
        );

      case "mission":
        return mission ? (
          <MissionDetail mission={mission} onStart={handleStartMission} />
        ) : (
          <EmptyState message="No mission available" />
        );

      case "region":
        return selectedRegion ? (
          <RegionDetail 
            region={selectedRegion} 
            onAddNode={onAddNodeToRegion ? () => onAddNodeToRegion(selectedRegion.id as "demand" | "feasibility" | "timing") : undefined}
          />
        ) : (
          <EmptyState message="Select a region to view details" />
        );

      case "add":
        return addNodeRegion && onSaveNewNode ? (
          <div className="space-y-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(96, 165, 250, 0.1)", border: "1px solid rgba(96, 165, 250, 0.2)" }}
            >
              <p className="text-sm" style={{ color: "#60a5fa" }}>
                Adding node to <strong className="capitalize">{addNodeRegion}</strong> region
              </p>
            </div>
            <NodeEditor
              mode="create"
              regionId={addNodeRegion}
              onSave={onSaveNewNode}
              onCancel={onClose}
            />
          </div>
        ) : (
          <EmptyState message="Cannot add node" />
        );

      default:
        return <EmptyState message="Nothing selected" />;
    }
  };

  // Get title based on mode
  const getTitle = () => {
    switch (mode) {
      case "node":
        return selectedNode?.label || (selectedNode as unknown as { title?: string })?.title || "Node Details";
      case "mission":
        return mission?.mission_name || "Current Mission";
      case "region":
        return getRegionLabel(selectedRegion) || "Region Details";
      case "add":
        return "Add New Node";
      default:
        return "Details";
    }
  };

  return (
    <aside className={`side-panel ${isOpen ? "open" : ""}`}>
      <header className="side-panel-header">
        <h2 className="side-panel-title">{getTitle()}</h2>
        <button
          className="side-panel-close"
          onClick={onClose}
          aria-label="Close panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>
      <div className="side-panel-content">
        {renderContent()}
      </div>
    </aside>
  );
}

// Helper to get node label (handles old and new data structures)
function getNodeLabel(node: MapNode | null): string {
  if (!node) return "";
  return node.label || (node as unknown as { title?: string }).title || node.id || "Node";
}

// Node Detail Component - Dark theme
function NodeDetail({ node, onDelete }: { node: MapNode; onDelete?: () => void }) {
  const nodeLabel = getNodeLabel(node);
  
  return (
    <div className="space-y-6">
      {/* Node type badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: node.type === "assumption" ? "rgba(229, 69, 69, 0.15)" : "rgba(96, 165, 250, 0.15)",
            color: node.type === "assumption" ? "#e54545" : "#60a5fa",
            border: `1px solid ${node.type === "assumption" ? "rgba(229, 69, 69, 0.3)" : "rgba(96, 165, 250, 0.3)"}`,
          }}
        >
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
        </span>
        {node.status && (
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              backgroundColor:
                node.status === "validated" || node.status === "completed"
                  ? "rgba(74, 222, 128, 0.15)"
                  : node.status === "blocked"
                  ? "rgba(229, 69, 69, 0.15)"
                  : "rgba(58, 58, 66, 0.5)",
              color:
                node.status === "validated" || node.status === "completed"
                  ? "#4ade80"
                  : node.status === "blocked"
                  ? "#e54545"
                  : "#9a9aa8",
              border: `1px solid ${
                node.status === "validated" || node.status === "completed"
                  ? "rgba(74, 222, 128, 0.3)"
                  : node.status === "blocked"
                  ? "rgba(229, 69, 69, 0.3)"
                  : "rgba(58, 58, 66, 0.5)"
              }`,
            }}
          >
            {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
          </span>
        )}
      </div>

      {/* Node label/title */}
      <div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "#f0f0f0" }}
        >
          {nodeLabel}
        </h3>
        {node.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#9a9aa8" }}
          >
            {node.description}
          </p>
        )}
        {node.prompt && !node.description && (
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: "#9a9aa8" }}
          >
            {node.prompt}
          </p>
        )}
      </div>

      {/* Why it matters */}
      {node.why_it_matters && (
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: "rgba(245, 200, 66, 0.08)", border: "1px solid rgba(245, 200, 66, 0.2)" }}
        >
          <p
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "#f5c842" }}
          >
            Why it matters
          </p>
          <p
            className="text-sm"
            style={{ color: "#f0f0f0" }}
          >
            {node.why_it_matters}
          </p>
        </div>
      )}

      {/* Locked state message */}
      {node.locked && (
        <div
          className="p-4 rounded-lg border border-dashed"
          style={{
            backgroundColor: "rgba(58, 58, 66, 0.3)",
            borderColor: "#3a3a42",
          }}
        >
          <p className="text-sm" style={{ color: "#6a6a78" }}>
            🔒 This node is locked. Complete earlier missions to unlock.
          </p>
        </div>
      )}

      {/* User-created indicator */}
      {node.isUserCreated && (
        <div className="text-xs" style={{ color: "#6a6a78" }}>
          ✎ You added this node
        </div>
      )}

      {/* Connected nodes */}
      {node.connectedTo && node.connectedTo.length > 0 && (
        <div>
          <h4
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "#6a6a78" }}
          >
            Connected To
          </h4>
          <div className="flex flex-wrap gap-2">
            {node.connectedTo.map((id) => (
              <span
                key={id}
                className="px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: "rgba(58, 58, 66, 0.5)",
                  color: "#9a9aa8",
                  border: "1px solid #2a2a32",
                }}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Delete button for user-created nodes */}
      {node.isUserCreated && onDelete && (
        <button
          onClick={onDelete}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all mt-4 btn-danger"
        >
          DELETE NODE
        </button>
      )}
    </div>
  );
}

// Mission Detail Component - Dark theme
function MissionDetail({
  mission,
  onStart,
}: {
  mission: MissionProposal;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Mission name badge */}
      <div>
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider"
          style={{
            backgroundColor: "rgba(96, 165, 250, 0.15)",
            color: "#60a5fa",
            border: "1px solid rgba(96, 165, 250, 0.3)",
          }}
        >
          {mission.mission_name}
        </span>
      </div>

      {/* Mission goal */}
      <div>
        <h4
          className="text-xs font-medium mb-2 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Goal
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "#f0f0f0" }}>
          {mission.mission_goal}
        </p>
      </div>

      {/* Steps */}
      <div>
        <h4
          className="text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Steps
        </h4>
        <ol className="space-y-3">
          {mission.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: "#f5c842",
                  color: "#0d0d0f",
                }}
              >
                {idx + 1}
              </span>
              <span style={{ color: "#f0f0f0" }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Success/Failure signals */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
        >
          <h4
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "#4ade80" }}
          >
            Success
          </h4>
          <p className="text-xs" style={{ color: "#9a9aa8" }}>
            {mission.success_signal}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: "rgba(229, 69, 69, 0.08)", border: "1px solid rgba(229, 69, 69, 0.2)" }}
        >
          <h4
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "#e54545" }}
          >
            Failure
          </h4>
          <p className="text-xs" style={{ color: "#9a9aa8" }}>
            {mission.failure_signal}
          </p>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full py-3 px-4 rounded-lg font-semibold transition-all btn-primary"
      >
        START MISSION
      </button>
    </div>
  );
}

// Helper to get region properties (handles old and new data structures)
function getRegionLabel(region: Region | null): string {
  if (!region) return "";
  return region.label || (region as unknown as { title?: string }).title || region.id || "Unknown";
}

function getRegionClarity(region: Region): number {
  return region.clarity ?? (region as unknown as { clarity_score?: number }).clarity_score ?? 0;
}

function getRegionFog(region: Region): "high" | "medium" | "low" {
  return region.fog || (region as unknown as { fog_state?: "high" | "medium" | "low" }).fog_state || "high";
}

// Region Detail Component - Dark theme
function RegionDetail({ region, onAddNode }: { region: Region; onAddNode?: () => void }) {
  const regionLabel = getRegionLabel(region);
  const clarity = getRegionClarity(region);
  const fog = getRegionFog(region);
  const totalNodes = region.nodes?.length || 0;
  const completedNodes = (region.nodes || []).filter(
    (n) => n.status === "completed" || n.status === "validated"
  ).length;
  const blockedNodes = (region.nodes || []).filter((n) => n.status === "blocked").length;

  return (
    <div className="space-y-6">
      {/* Region clarity */}
      <div>
        <h4
          className="text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Clarity Score
        </h4>
        <div className="flex items-center gap-4">
          <span
            className="text-3xl font-bold"
            style={{
              color: clarity >= 70 ? "#4ade80" : clarity >= 40 ? "#60a5fa" : "#e54545",
            }}
          >
            {Math.round(clarity)}%
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a20" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${clarity}%`,
                backgroundColor: clarity >= 70 ? "#4ade80" : clarity >= 40 ? "#60a5fa" : "#e54545",
              }}
            />
          </div>
        </div>
      </div>

      {/* Fog state */}
      <div>
        <h4
          className="text-xs font-medium mb-2 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Exploration State
        </h4>
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize"
          style={{
            backgroundColor:
              fog === "low"
                ? "rgba(74, 222, 128, 0.15)"
                : fog === "medium"
                ? "rgba(96, 165, 250, 0.15)"
                : "rgba(229, 69, 69, 0.15)",
            color:
              fog === "low"
                ? "#4ade80"
                : fog === "medium"
                ? "#60a5fa"
                : "#e54545",
            border: `1px solid ${
              fog === "low"
                ? "rgba(74, 222, 128, 0.3)"
                : fog === "medium"
                ? "rgba(96, 165, 250, 0.3)"
                : "rgba(229, 69, 69, 0.3)"
            }`,
          }}
        >
          {fog === "low" ? "Explored" : fog === "medium" ? "Partially Explored" : "Unexplored"}
        </span>
      </div>

      {/* Node stats */}
      <div>
        <h4
          className="text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Node Summary
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "rgba(58, 58, 66, 0.3)", border: "1px solid #2a2a32" }}
          >
            <div className="text-xl font-bold" style={{ color: "#f0f0f0" }}>
              {totalNodes}
            </div>
            <div className="text-xs" style={{ color: "#6a6a78" }}>
              Total
            </div>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
          >
            <div className="text-xl font-bold" style={{ color: "#4ade80" }}>
              {completedNodes}
            </div>
            <div className="text-xs" style={{ color: "#6a6a78" }}>
              Cleared
            </div>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "rgba(229, 69, 69, 0.08)", border: "1px solid rgba(229, 69, 69, 0.2)" }}
          >
            <div className="text-xl font-bold" style={{ color: "#e54545" }}>
              {blockedNodes}
            </div>
            <div className="text-xs" style={{ color: "#6a6a78" }}>
              Blocked
            </div>
          </div>
        </div>
      </div>

      {/* Add node button */}
      {onAddNode && (
        <button
          onClick={onAddNode}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 btn-blackboard"
          style={{ backgroundColor: "rgba(96, 165, 250, 0.1)", borderColor: "rgba(96, 165, 250, 0.3)", color: "#60a5fa" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          ADD NODE
        </button>
      )}

      {/* Node list */}
      <div>
        <h4
          className="text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Nodes in this Region
        </h4>
        <ul className="space-y-2">
          {(region.nodes || []).map((node) => {
            const nodeLabel = node.label || (node as unknown as { title?: string }).title || node.id || "Node";
            return (
              <li
                key={node.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(26, 26, 32, 0.5)",
                  borderLeft: `3px solid ${
                    node.status === "validated" || node.status === "completed"
                      ? "#4ade80"
                      : node.status === "blocked"
                      ? "#e54545"
                      : "#3a3a42"
                  }`,
                }}
              >
                <span className="text-sm" style={{ color: "#f0f0f0" }}>
                  {nodeLabel}
                  {node.isUserCreated && (
                    <span className="ml-1 text-xs" style={{ color: "#6a6a78" }}>✎</span>
                  )}
                </span>
                {node.status && (
                  <span
                    className="text-xs px-2 py-0.5 rounded capitalize"
                    style={{
                      backgroundColor:
                        node.status === "validated" || node.status === "completed"
                          ? "rgba(74, 222, 128, 0.15)"
                          : node.status === "blocked"
                          ? "rgba(229, 69, 69, 0.15)"
                          : "rgba(58, 58, 66, 0.5)",
                      color:
                        node.status === "validated" || node.status === "completed"
                          ? "#4ade80"
                          : node.status === "blocked"
                          ? "#e54545"
                          : "#9a9aa8",
                    }}
                  >
                    {node.status}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// Empty State Component - Dark theme
function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      style={{ color: "#6a6a78" }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mb-4 opacity-50"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M9 9h.01M15 9h.01M9 15c.5.5 1.5 1 3 1s2.5-.5 3-1" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
