"use client";

import { useState, useCallback } from "react";
import type { UncertaintyMapUIModel, MapNode, NodeType } from "@/lib/mapModel";
import MapRegion from "./MapRegion";
import MapNodeComponent from "./MapNode";
import SidePanel from "./SidePanel";
import { PathConnectorGroup } from "./PathConnector";
import type { MissionProposal } from "@/lib/types";

interface ExplorerMapProps {
  map: UncertaintyMapUIModel;
  mission?: MissionProposal;
  nickname: string;
  goal?: string;
  onNodeClick?: (node: MapNode) => void;
  onMissionClick?: () => void;
  onAddNode?: (regionId: "demand" | "feasibility" | "timing", node: { label: string; type: NodeType; x: number; y: number; description?: string }) => void;
  onDeleteNode?: (nodeId: string) => void;
}

// SVG viewBox dimensions
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 700;

// Region positions and sizes
const REGION_CONFIG = {
  demand: {
    x: 50,
    y: 80,
    width: 280,
    height: 560,
    labelX: 190,
    labelY: 100,
  },
  feasibility: {
    x: 360,
    y: 80,
    width: 280,
    height: 560,
    labelX: 500,
    labelY: 100,
  },
  timing: {
    x: 670,
    y: 80,
    width: 280,
    height: 560,
    labelX: 810,
    labelY: 100,
  },
};

export default function ExplorerMap({
  map,
  mission,
  nickname,
  goal,
  onNodeClick,
  onMissionClick,
  onAddNode,
  onDeleteNode,
}: ExplorerMapProps) {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"node" | "mission" | "region" | "add">("node");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [addNodeRegion, setAddNodeRegion] = useState<"demand" | "feasibility" | "timing" | null>(null);

  const handleNodeClick = useCallback((node: MapNode) => {
    setSelectedNode(node);
    setPanelMode("node");
    setPanelOpen(true);
    onNodeClick?.(node);
  }, [onNodeClick]);

  const handleRegionClick = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
    setPanelMode("region");
    setPanelOpen(true);
  }, []);

  const handleMissionClick = useCallback(() => {
    setPanelMode("mission");
    setPanelOpen(true);
    onMissionClick?.();
  }, [onMissionClick]);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
    setSelectedNode(null);
    setSelectedRegion(null);
    setAddNodeRegion(null);
  }, []);

  const handleAddNodeToRegion = useCallback((regionId: "demand" | "feasibility" | "timing") => {
    setAddNodeRegion(regionId);
    setPanelMode("add");
    setPanelOpen(true);
  }, []);

  const handleSaveNewNode = useCallback((data: { label: string; type: NodeType; description?: string }) => {
    if (addNodeRegion && onAddNode) {
      // Place node at random position within region
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 60;
      onAddNode(addNodeRegion, { ...data, x, y });
    }
    handleClosePanel();
  }, [addNodeRegion, onAddNode, handleClosePanel]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
    handleClosePanel();
  }, [onDeleteNode, handleClosePanel]);

  return (
    <div className="explorer-map-container">
      {/* Subtle texture overlay */}
      <div className="texture-overlay" />
      <div className="vignette-overlay" />

      {/* Goal Anchor - Top right corner */}
      {goal && (
        <div className="goal-anchor">
          <div className="goal-anchor-label">NORTH STAR</div>
          <div className="goal-anchor-text">{goal}</div>
        </div>
      )}

      {/* Overall Clarity - Top center */}
      <div className="clarity-indicator">
        <span className="clarity-label">Clarity</span>
        <span className="clarity-value">{Math.round(map.overall_readiness)}%</span>
        <div className="clarity-bar">
          <div 
            className="clarity-fill" 
            style={{ width: `${map.overall_readiness}%` }}
          />
        </div>
      </div>

      {/* Main SVG Map */}
      <svg
        className="explorer-map-svg map-reveal"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for filters */}
        <defs>
          {/* Subtle glow filter for primary region */}
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Darkness gradient for unexplored areas */}
          <linearGradient id="darknessGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d0d0f" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0d0d0f" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0d0d0f" stopOpacity="0.9" />
          </linearGradient>

          {/* Subtle grid pattern */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="#1a1a20" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Background - Matte black surface */}
        <rect
          x="0"
          y="0"
          width={VIEW_WIDTH}
          height={VIEW_HEIGHT}
          fill="#0d0d0f"
          className="blackboard-bg"
        />

        {/* Subtle grid overlay */}
        <rect
          x="0"
          y="0"
          width={VIEW_WIDTH}
          height={VIEW_HEIGHT}
          fill="url(#gridPattern)"
          opacity="0.3"
        />

        {/* Minimal border */}
        <rect
          x="20"
          y="20"
          width={VIEW_WIDTH - 40}
          height={VIEW_HEIGHT - 40}
          fill="none"
          stroke="#2a2a32"
          strokeWidth="1"
          rx="4"
          opacity="0.5"
        />

        {/* Map Title - Minimal */}
        <text
          x={VIEW_WIDTH / 2}
          y="50"
          textAnchor="middle"
          fill="#4a4a54"
          fontSize="11"
          fontWeight="500"
          letterSpacing="3"
          style={{ fontFamily: "var(--font-header)" }}
        >
          {nickname.toUpperCase()}&apos;S JOURNEY
        </text>

        {/* Calculate all node positions for connections */}
        {(() => {
          const nodePositions: Record<string, { x: number; y: number }> = {};
          (["demand", "feasibility", "timing"] as const).forEach((regionId) => {
            const region = map.regions[regionId];
            const config = REGION_CONFIG[regionId];
            (region.nodes || []).forEach((node, idx) => {
              nodePositions[node.id] = {
                x: config.x + (node.x ?? 50) * (config.width / 100),
                y: config.y + 100 + (node.y ?? idx * 80) * (config.height - 130) / 100,
              };
            });
          });

          return (
            <>
              {/* Render connections first (below nodes) */}
              {map.connections && map.connections.length > 0 && (
                <PathConnectorGroup
                  connections={map.connections}
                  nodePositions={nodePositions}
                />
              )}
            </>
          );
        })()}

        {/* Three Regions */}
        {(["demand", "feasibility", "timing"] as const).map((regionId) => {
          const region = map.regions[regionId];
          const config = REGION_CONFIG[regionId];
          const isPrimary = map.primary_uncertainty === regionId;

          return (
            <MapRegion
              key={regionId}
              region={region}
              config={config}
              isPrimary={isPrimary}
              onClick={() => handleRegionClick(regionId)}
            >
              {/* Render nodes for this region */}
              {(region.nodes || []).map((node, idx) => {
                // Calculate node position within region
                const nodeX = config.x + (node.x ?? 50) * (config.width / 100);
                const nodeY = config.y + 100 + (node.y ?? idx * 80) * (config.height - 130) / 100;

                return (
                  <MapNodeComponent
                    key={node.id}
                    node={node}
                    x={nodeX}
                    y={nodeY}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => handleNodeClick(node)}
                  />
                );
              })}
            </MapRegion>
          );
        })}

        {/* Overall progress indicator at bottom */}
        <g transform={`translate(${VIEW_WIDTH / 2}, ${VIEW_HEIGHT - 35})`}>
          <rect
            x="-150"
            y="-3"
            width="300"
            height="6"
            fill="#1a1a20"
            rx="3"
          />
          <rect
            x="-150"
            y="-3"
            width={300 * (map.overall_readiness / 100)}
            height="6"
            fill={map.overall_readiness >= 70 ? "#4ade80" : map.overall_readiness >= 40 ? "#60a5fa" : "#f5c842"}
            rx="3"
            style={{ transition: "width 0.6s ease-out" }}
          />
        </g>
      </svg>

      {/* Map Legend - Minimal */}
      <div className="map-legend">
        <div className="legend-title">SYMBOLS</div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="4" fill="#60a5fa" />
            </svg>
          </div>
          <span>Checkpoint</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <line x1="2" y1="3" x2="2" y2="11" stroke="#e54545" strokeWidth="1.5" />
              <path d="M2 3 L10 6 L2 9" fill="#e54545" />
            </svg>
          </div>
          <span>Assumption</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill="#4ade80" />
            </svg>
          </div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <line x1="3" y1="3" x2="11" y2="11" stroke="#e54545" strokeWidth="2" />
              <line x1="11" y1="3" x2="3" y2="11" stroke="#e54545" strokeWidth="2" />
            </svg>
          </div>
          <span>Blocked</span>
        </div>
      </div>

      {/* Mission button */}
      {mission && (
        <div className="map-controls">
          <button
            className="map-control-btn"
            onClick={handleMissionClick}
            title="View Current Mission"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </button>
        </div>
      )}

      {/* Side Panel */}
      <SidePanel
        isOpen={panelOpen}
        onClose={handleClosePanel}
        mode={panelMode}
        selectedNode={selectedNode}
        selectedRegion={selectedRegion ? map.regions[selectedRegion as keyof typeof map.regions] : null}
        mission={mission}
        addNodeRegion={addNodeRegion}
        onSaveNewNode={handleSaveNewNode}
        onDeleteNode={selectedNode?.isUserCreated ? () => handleDeleteNode(selectedNode.id) : undefined}
        onAddNodeToRegion={handleAddNodeToRegion}
      />

      {/* Backdrop for panel */}
      <div
        className={`panel-backdrop ${panelOpen ? "visible" : ""}`}
        onClick={handleClosePanel}
      />
    </div>
  );
}
