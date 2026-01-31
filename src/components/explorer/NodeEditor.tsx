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
          className="block text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Label *
        </label>
        <input
          id="node-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter node label..."
          className="w-full px-4 py-3 rounded border-2 focus:outline-none focus:border-[#3a5a8b]"
          style={{
            backgroundColor: "#f4e4c1",
            borderColor: "#8b7355",
            color: "#2c2416",
            fontFamily: "var(--font-body)",
          }}
          maxLength={50}
          required
        />
        <p
          className="text-xs mt-1"
          style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
        >
          {label.length}/50 characters
        </p>
      </div>

      {/* Type selection */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["assumption", "checkpoint", "note"] as NodeType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`p-3 rounded border-2 text-sm capitalize transition-all ${
                type === t ? "ring-2 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: type === t ? getTypeColor(t) : "#f4e4c1",
                borderColor: getTypeColor(t),
                color: type === t ? "#f4e4c1" : "#2c2416",
                fontFamily: "var(--font-body)",
                // Ring color handled via --tw-ring-color
                ["--tw-ring-color" as string]: getTypeColor(t),
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
          className="block text-sm font-medium mb-2"
          style={{ color: "#8b7355", fontFamily: "var(--font-header)" }}
        >
          Description (optional)
        </label>
        <textarea
          id="node-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note or description..."
          rows={3}
          className="w-full px-4 py-3 rounded border-2 focus:outline-none focus:border-[#3a5a8b] resize-none"
          style={{
            backgroundColor: "#f4e4c1",
            borderColor: "#8b7355",
            color: "#2c2416",
            fontFamily: "var(--font-annotation)",
          }}
          maxLength={200}
        />
        <p
          className="text-xs mt-1"
          style={{ color: "#8b7355", fontFamily: "var(--font-body)" }}
        >
          {description.length}/200 characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!label.trim()}
          className="flex-1 py-3 px-4 rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#3a6b3a",
            color: "#f4e4c1",
            fontFamily: "var(--font-header)",
            letterSpacing: "1px",
          }}
        >
          {mode === "create" ? "ADD NODE" : "SAVE CHANGES"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded font-medium transition-all"
          style={{
            backgroundColor: "transparent",
            border: "2px solid #8b7355",
            color: "#8b7355",
            fontFamily: "var(--font-header)",
            letterSpacing: "1px",
          }}
        >
          CANCEL
        </button>
      </div>

      {/* Delete button for edit mode */}
      {mode === "edit" && node?.isUserCreated && onDelete && (
        <button
          type="button"
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
    </form>
  );
}

// Helper function to get color for node type
function getTypeColor(type: NodeType): string {
  switch (type) {
    case "assumption":
      return "#8b3a3a";
    case "checkpoint":
      return "#3a5a8b";
    case "note":
      return "#8b7355";
    default:
      return "#8b7355";
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
