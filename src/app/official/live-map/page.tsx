"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { GoogleMap } from "@/components/shared/google-map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mapReportsData, type MapReport } from "@/lib/data";

type Filter = "Still There" | "Cleaned" | "Hazardous";

export default function LiveMapPage() {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);

  const filters: Filter[] = ["Still There", "Cleaned", "Hazardous"];

  const pinColors: Record<string, string> = {
    "Still There": "bg-red-500",
    "Cleaned": "bg-green-500",
    "Hazardous": "bg-yellow-500",
  };

  const handleFilterClick = (filter: Filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredReports = useMemo(() => {
    if (activeFilters.length === 0) {
      return mapReportsData;
    }
    return mapReportsData.filter((report) =>
      activeFilters.includes(report.category as Filter)
    );
  }, [activeFilters]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Live Litter Map"
        description="Monitor all reports across the city and identify high-density zones."
      />
      <div className="flex flex-wrap gap-4 mb-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilters.includes(filter) ? "default" : "outline"}
            onClick={() => handleFilterClick(filter)}
            className="transition-colors"
          >
            <span
              className={cn("w-3 h-3 rounded-full mr-2", pinColors[filter])}
            ></span>
            {filter}
          </Button>
        ))}
      </div>
      <div className="flex-1">
        <GoogleMap
          reports={filteredReports}
          selectedReportId={selectedReport?.id || null}
          onMarkerSelect={setSelectedReport}
        />
      </div>
    </div>
  );
}
