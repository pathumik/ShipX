"use client";

import { useState } from "react";
import type { MapNode, NodeType } from "@/lib/mapModel";

interface NodeEditorProps {
  mode: "create" | "edit";
  node?: MapNode;
  regionId?: string;
  onSave: (data: {
    label: string;
    type: NodeType;
    description?: string;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function NodeEditor({
  mode,
  node,
  onSave,
  onDelete,
  onCancel,
}: NodeEditorProps) {
  const [label, setLabel] = useState(node?.label || "");
  const [type, setType] = useState<NodeType>(node?.type || "assumption");
  const [description, setDescription] = useState(node?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    onSave({
      label: label.trim(),
      type,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Label input */}
      <div>
        <label
          htmlFor="node-label"
          className="block text-xs font-medium mb-2 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Label *
        </label>
        <input
          id="node-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter node label..."
          className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
          style={{
            backgroundColor: "#1a1a20",
            border: "1px solid #2a2a32",
            color: "#f0f0f0",
          }}
          maxLength={50}
          required
        />
        <p className="text-xs mt-1" style={{ color: "#4a4a54" }}>
          {label.length}/50 characters
        </p>
      </div>

      {/* Type selection */}
      <div>
        <label
          className="block text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["assumption", "checkpoint", "note"] as NodeType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="p-3 rounded-lg text-sm capitalize transition-all"
              style={{
                backgroundColor: type === t ? getTypeColor(t) + "20" : "#1a1a20",
                border: `1px solid ${type === t ? getTypeColor(t) : "#2a2a32"}`,
                color: type === t ? getTypeColor(t) : "#9a9aa8",
              }}
            >
              <span className="block text-lg mb-1">{getTypeIcon(t)}</span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Description textarea */}
      <div>
        <label
          htmlFor="node-description"
          className="block text-xs font-medium mb-2 uppercase tracking-wider"
          style={{ color: "#6a6a78" }}
        >
          Description (optional)
        </label>
        <textarea
          id="node-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note or description..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg focus:outline-none resize-none transition-colors"
          style={{
            backgroundColor: "#1a1a20",
            border: "1px solid #2a2a32",
            color: "#f0f0f0",
          }}
          maxLength={200}
        />
        <p className="text-xs mt-1" style={{ color: "#4a4a54" }}>
          {description.length}/200 characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!label.trim()}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
        >
          {mode === "create" ? "ADD NODE" : "SAVE CHANGES"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg font-medium transition-all btn-blackboard"
        >
          CANCEL
        </button>
      </div>

      {/* Delete button for edit mode */}
      {mode === "edit" && node?.isUserCreated && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all mt-4 btn-danger"
        >
          DELETE NODE
        </button>
      )}
    </form>
  );
}

// Helper function to get color for node type - using semantic colors
function getTypeColor(type: NodeType): string {
  switch (type) {
    case "assumption":
      return "#e54545"; // Red - risk
    case "checkpoint":
      return "#60a5fa"; // Blue - evidence
    case "note":
      return "#9a9aa8"; // Muted
    default:
      return "#9a9aa8";
  }
}

// Helper function to get icon for node type
function getTypeIcon(type: NodeType): string {
  switch (type) {
    case "assumption":
      return "🚩";
    case "checkpoint":
      return "●";
    case "note":
      return "📝";
    default:
      return "?";
  }
}
