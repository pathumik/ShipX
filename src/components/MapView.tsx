"use client";

import type { UncertaintyMapUIModel } from "@/lib/mapModel";
import RegionCard from "./RegionCard";

interface MapViewProps {
  map: UncertaintyMapUIModel;
}

export default function MapView({ map }: MapViewProps) {
  const regions = [
    { key: "demand" as const, data: map.regions.demand },
    { key: "feasibility" as const, data: map.regions.feasibility },
    { key: "timing" as const, data: map.regions.timing },
  ];

  return (
    <div className="h-full p-4 overflow-y-auto">
      {/* Overall readiness */}
      <div className="mb-6 text-center animate-fade-in">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--surface)] rounded-full border border-[var(--surface-border)]">
          <span className="text-sm text-[var(--text-dim)]">Overall Clarity</span>
          <div className="w-24 h-2 bg-[var(--surface-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] transition-all duration-500"
              style={{ width: `${map.overall_readiness}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[var(--foreground)]">
            {Math.round(map.overall_readiness)}%
          </span>
        </div>
      </div>

      {/* Region cards */}
      <div className="space-y-4">
        {regions.map((region, index) => (
          <div
            key={region.key}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <RegionCard
              region={region.data}
              isPrimary={region.key === map.primary_uncertainty}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-[var(--surface)] rounded-xl border border-[var(--surface-border)]">
        <p className="text-xs text-[var(--text-muted)] mb-3">Fog Levels</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--secondary)] opacity-80" />
            <span className="text-xs text-[var(--text-dim)]">High (unknown)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--tertiary)] opacity-60" />
            <span className="text-xs text-[var(--text-dim)]">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--primary)] opacity-40" />
            <span className="text-xs text-[var(--text-dim)]">Low (clear)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
