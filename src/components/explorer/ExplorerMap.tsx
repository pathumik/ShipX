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
    y: 50,
    width: 280,
    height: 600,
    labelX: 190,
    labelY: 80,
  },
  feasibility: {
    x: 360,
    y: 50,
    width: 280,
    height: 600,
    labelX: 500,
    labelY: 80,
  },
  timing: {
    x: 670,
    y: 50,
    width: 280,
    height: 600,
    labelX: 810,
    labelY: 80,
  },
};

export default function ExplorerMap({
  map,
  mission,
  nickname,
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
      {/* Texture overlays */}
      <div className="texture-overlay" />
      <div className="vignette-overlay" />

      {/* Main SVG Map */}
      <svg
        className="explorer-map-svg map-reveal"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for patterns and filters */}
        <defs>
          {/* Parchment pattern */}
          <pattern
            id="parchmentPattern"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
          >
            <rect width="100" height="100" fill="#f4e4c1" />
            <circle cx="50" cy="50" r="40" fill="#e8d4a8" opacity="0.3" />
          </pattern>

          {/* Paper texture filter */}
          <filter id="paperTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="5"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#f4e4c1"
              surfaceScale="2"
              result="light"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply" />
          </filter>

          {/* Fog gradient for each region */}
          <linearGradient id="fogGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4e4c1" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e8d4a8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f4e4c1" stopOpacity="0.9" />
          </linearGradient>

          {/* Hand-drawn effect filter */}
          <filter id="handDrawn" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Drop shadow for nodes */}
          <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#8b7355" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background */}
        <rect
          x="0"
          y="0"
          width={VIEW_WIDTH}
          height={VIEW_HEIGHT}
          fill="#f4e4c1"
          className="parchment-bg"
        />

        {/* Decorative border */}
        <rect
          x="10"
          y="10"
          width={VIEW_WIDTH - 20}
          height={VIEW_HEIGHT - 20}
          fill="none"
          stroke="#8b7355"
          strokeWidth="3"
          strokeDasharray="15 5 5 5"
          rx="5"
        />

        {/* Inner border */}
        <rect
          x="25"
          y="25"
          width={VIEW_WIDTH - 50}
          height={VIEW_HEIGHT - 50}
          fill="none"
          stroke="#8b7355"
          strokeWidth="1"
          opacity="0.5"
          rx="3"
        />

        {/* Map Title */}
        <text
          x={VIEW_WIDTH / 2}
          y="35"
          textAnchor="middle"
          className="region-label"
          style={{ fontSize: "14px", letterSpacing: "4px" }}
        >
          {nickname.toUpperCase()}&apos;S UNCERTAINTY MAP
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
                y: config.y + 120 + (node.y ?? idx * 80) * (config.height - 150) / 100,
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
                const nodeY = config.y + 120 + (node.y ?? idx * 80) * (config.height - 150) / 100;

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

        {/* Compass Rose (decorative) */}
        <g transform="translate(920, 620)" opacity="0.6">
          <circle cx="0" cy="0" r="25" fill="none" stroke="#8b7355" strokeWidth="1" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke="#8b7355" strokeWidth="1" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#8b7355" strokeWidth="1" />
          <text x="0" y="-28" textAnchor="middle" fill="#8b7355" fontSize="10">N</text>
          <polygon points="0,-15 -4,-5 4,-5" fill="#8b7355" />
        </g>

        {/* Overall Readiness indicator */}
        <g transform={`translate(${VIEW_WIDTH / 2}, ${VIEW_HEIGHT - 30})`}>
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#8b7355"
            fontSize="11"
            style={{ fontFamily: "var(--font-body)" }}
          >
            OVERALL CLARITY: {Math.round(map.overall_readiness)}%
          </text>
          <rect
            x="-60"
            y="8"
            width="120"
            height="6"
            fill="#d4c49a"
            rx="3"
          />
          <rect
            x="-60"
            y="8"
            width={120 * (map.overall_readiness / 100)}
            height="6"
            fill="#3a6b3a"
            rx="3"
          />
        </g>
      </svg>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-title">LEGEND</div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2 L10 6 L8 14 L6 6 Z" fill="none" stroke="#8b3a3a" strokeWidth="1.5" />
            </svg>
          </div>
          <span>Assumption</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" fill="#3a5a8b" />
            </svg>
          </div>
          <span>Checkpoint</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)" fill="#3a6b3a" />
            </svg>
          </div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-symbol" style={{ opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" fill="none" stroke="#8b7355" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
          <span>Locked</span>
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
