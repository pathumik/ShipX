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
              className="p-3 rounded"
              style={{ backgroundColor: "rgba(58, 90, 139, 0.1)" }}
            >
              <p
                className="text-sm"
                style={{ color: "#3a5a8b", fontFamily: "var(--font-body)" }}
              >
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
        return selectedNode?.label || "Node Details";
      case "mission":
        return mission?.name || "Current Mission";
      case "region":
        return selectedRegion?.label || "Region Details";
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

// Node Detail Component
function NodeDetail({ node, onDelete }: { node: MapNode; onDelete?: () => void }) {
  return (
    <div className="space-y-6">
      {/* Node type badge */}
      <div className="flex items-center gap-2">
        <span
          className="px-3 py-1 rounded text-sm font-medium"
          style={{
            backgroundColor: node.type === "assumption" ? "rgba(139, 58, 58, 0.15)" : "rgba(58, 90, 139, 0.15)",
            color: node.type === "assumption" ? "#8b3a3a" : "#3a5a8b",
            fontFamily: "var(--font-body)",
          }}
        >
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
        </span>
        {node.status && (
          <span
            className="px-3 py-1 rounded text-sm font-medium"
            style={{
              backgroundColor:
                node.status === "validated" || node.status === "completed"
                  ? "rgba(58, 107, 58, 0.15)"
                  : node.status === "blocked"
                  ? "rgba(139, 58, 58, 0.15)"
                  : "rgba(139, 115, 85, 0.15)",
              color:
                node.status === "validated" || node.status === "completed"
                  ? "#3a6b3a"
                  : node.status === "blocked"
                  ? "#8b3a3a"
                  : "#8b7355",
              fontFamily: "var(--font-body)",
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
          style={{ color: "#2c2416", fontFamily: "var(--font-header)" }}
        >
          {node.label}
        </h3>
        {node.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#4a3d2e", fontFamily: "var(--font-body)" }}
          >
            {node.description}
          </p>
        )}
        {node.prompt && !node.description && (
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: "#4a3d2e", fontFamily: "var(--font-body)" }}
          >
            {node.prompt}
          </p>
        )}
      </div>

      {/* Why it matters */}
      {node.why_it_matters && (
        <div
          className="p-3 rounded"
          style={{ backgroundColor: "rgba(139, 115, 85, 0.1)" }}
        >
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
          >
            Why it matters
          </p>
          <p
            className="text-sm"
            style={{ color: "#2c2416", fontFamily: "var(--font-body)" }}
          >
            {node.why_it_matters}
          </p>
        </div>
      )}

      {/* Locked state message */}
      {node.locked && (
        <div
          className="p-4 rounded border-2 border-dashed"
          style={{
            backgroundColor: "rgba(139, 115, 85, 0.1)",
            borderColor: "#8b7355",
          }}
        >
          <p
            className="text-sm"
            style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
          >
            🔒 This node is locked. Complete earlier missions to unlock.
          </p>
        </div>
      )}

      {/* User-created indicator */}
      {node.isUserCreated && (
        <div
          className="text-xs italic"
          style={{ color: "#8b7355", fontFamily: "var(--font-annotation)" }}
        >
          ✎ You added this node
        </div>
      )}

      {/* Connected nodes */}
      {node.connectedTo && node.connectedTo.length > 0 && (
        <div>
          <h4
            className="text-sm font-medium mb-2"
            style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
          >
            Connected To
          </h4>
          <div className="flex flex-wrap gap-2">
            {node.connectedTo.map((id) => (
              <span
                key={id}
                className="px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: "rgba(139, 115, 85, 0.15)",
                  color: "#8b7355",
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
          className="w-full py-3 px-4 rounded font-medium transition-all mt-4"
          style={{
            backgroundColor: "transparent",
            border: "2px solid #8b3a3a",
            color: "#8b3a3a",
            fontFamily: "var(--font-header)",
            letterSpacing: "1px",
          }}
        >
          DELETE NODE
        </button>
      )}
    </div>
  );
}

// Mission Detail Component
function MissionDetail({
  mission,
  onStart,
}: {
  mission: MissionProposal;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Mission type badge */}
      <div>
        <span
          className="px-3 py-1 rounded text-sm font-medium"
          style={{
            backgroundColor: "rgba(58, 90, 139, 0.15)",
            color: "#3a5a8b",
            fontFamily: "var(--font-body)",
          }}
        >
          {mission.type.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Mission goal */}
      <div>
        <h4
          className="text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Goal
        </h4>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#2c2416", fontFamily: "var(--font-body)" }}
        >
          {mission.goal}
        </p>
      </div>

      {/* Steps */}
      <div>
        <h4
          className="text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Steps
        </h4>
        <ol className="space-y-2">
          {mission.steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: "#8b7355",
                  color: "#f4e4c1",
                }}
              >
                {idx + 1}
              </span>
              <span style={{ color: "#2c2416" }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Success/Failure signals */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4
            className="text-sm font-medium mb-2"
            style={{ color: "#3a6b3a", fontFamily: "var(--font-header)" }}
          >
            Success Signal
          </h4>
          <p
            className="text-sm"
            style={{ color: "#2c2416", fontFamily: "var(--font-body)" }}
          >
            {mission.success_signal}
          </p>
        </div>
        <div>
          <h4
            className="text-sm font-medium mb-2"
            style={{ color: "#8b3a3a", fontFamily: "var(--font-header)" }}
          >
            Failure Signal
          </h4>
          <p
            className="text-sm"
            style={{ color: "#2c2416", fontFamily: "var(--font-body)" }}
          >
            {mission.failure_signal}
          </p>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full py-3 px-4 rounded font-medium transition-all"
        style={{
          backgroundColor: "#3a6b3a",
          color: "#f4e4c1",
          fontFamily: "var(--font-header)",
          letterSpacing: "1px",
        }}
      >
        START MISSION
      </button>
    </div>
  );
}

// Helper to get region properties (handles old and new data structures)
function getRegionLabel(region: Region): string {
  return region.label || (region as unknown as { title?: string }).title || region.id || "Unknown";
}

function getRegionClarity(region: Region): number {
  return region.clarity ?? (region as unknown as { clarity_score?: number }).clarity_score ?? 0;
}

function getRegionFog(region: Region): "high" | "medium" | "low" {
  return region.fog || (region as unknown as { fog_state?: "high" | "medium" | "low" }).fog_state || "high";
}

// Region Detail Component
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
          className="text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Clarity Score
        </h4>
        <div className="flex items-center gap-4">
          <span
            className="text-3xl font-bold"
            style={{
              color: clarity >= 70 ? "#3a6b3a" : clarity >= 40 ? "#3a5a8b" : "#8b3a3a",
              fontFamily: "var(--font-header)",
            }}
          >
            {Math.round(clarity)}%
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#d4c49a" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${clarity}%`,
                backgroundColor: clarity >= 70 ? "#3a6b3a" : clarity >= 40 ? "#3a5a8b" : "#8b3a3a",
              }}
            />
          </div>
        </div>
      </div>

      {/* Fog state */}
      <div>
        <h4
          className="text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Fog State
        </h4>
        <span
          className="px-3 py-1 rounded text-sm font-medium capitalize"
          style={{
            backgroundColor:
              fog === "low"
                ? "rgba(58, 107, 58, 0.15)"
                : fog === "medium"
                ? "rgba(58, 90, 139, 0.15)"
                : "rgba(139, 58, 58, 0.15)",
            color:
              fog === "low"
                ? "#3a6b3a"
                : fog === "medium"
                ? "#3a5a8b"
                : "#8b3a3a",
            fontFamily: "var(--font-body)",
          }}
        >
          {fog} fog
        </span>
      </div>

      {/* Node stats */}
      <div>
        <h4
          className="text-sm font-medium mb-3"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Node Summary
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "rgba(139, 115, 85, 0.1)" }}
          >
            <div
              className="text-xl font-bold"
              style={{ color: "#2c2416", fontFamily: "var(--font-header)" }}
            >
              {totalNodes}
            </div>
            <div
              className="text-xs"
              style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
            >
              Total
            </div>
          </div>
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "rgba(58, 107, 58, 0.1)" }}
          >
            <div
              className="text-xl font-bold"
              style={{ color: "#3a6b3a", fontFamily: "var(--font-header)" }}
            >
              {completedNodes}
            </div>
            <div
              className="text-xs"
              style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
            >
              Cleared
            </div>
          </div>
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "rgba(139, 58, 58, 0.1)" }}
          >
            <div
              className="text-xl font-bold"
              style={{ color: "#8b3a3a", fontFamily: "var(--font-header)" }}
            >
              {blockedNodes}
            </div>
            <div
              className="text-xs"
              style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
            >
              Blocked
            </div>
          </div>
        </div>
      </div>

      {/* Add node button */}
      {onAddNode && (
        <button
          onClick={onAddNode}
          className="w-full py-3 px-4 rounded font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: "#3a5a8b",
            color: "#f4e4c1",
            fontFamily: "var(--font-header)",
            letterSpacing: "1px",
          }}
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
          className="text-sm font-medium mb-3"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Nodes in this Region
        </h4>
        <ul className="space-y-2">
          {(region.nodes || []).map((node) => (
            <li
              key={node.id}
              className="flex items-center justify-between p-2 rounded"
              style={{
                backgroundColor: "rgba(139, 115, 85, 0.05)",
                borderLeft: `3px solid ${
                  node.status === "validated" || node.status === "completed"
                    ? "#3a6b3a"
                    : node.status === "blocked"
                    ? "#8b3a3a"
                    : "#8b7355"
                }`,
              }}
            >
              <span
                className="text-sm"
                style={{ color: "#2c2416", fontFamily: "var(--font-body)" }}
              >
                {node.label}
                {node.isUserCreated && (
                  <span className="ml-1 text-xs" style={{ color: "#8b7355" }}>✎</span>
                )}
              </span>
              {node.status && (
                <span
                  className="text-xs px-2 py-0.5 rounded capitalize"
                  style={{
                    backgroundColor:
                      node.status === "validated" || node.status === "completed"
                        ? "rgba(58, 107, 58, 0.15)"
                        : node.status === "blocked"
                        ? "rgba(139, 58, 58, 0.15)"
                        : "rgba(139, 115, 85, 0.15)",
                    color:
                      node.status === "validated" || node.status === "completed"
                        ? "#3a6b3a"
                        : node.status === "blocked"
                        ? "#8b3a3a"
                        : "#8b7355",
                  }}
                >
                  {node.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      style={{ color: "#8b7355" }}
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
      <p style={{ fontFamily: "var(--font-body)" }}>{message}</p>
    </div>
  );
}
