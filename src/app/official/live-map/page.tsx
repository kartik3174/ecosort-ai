import { PageHeader } from "@/components/shared/page-header";
import { GoogleMap } from "@/components/shared/google-map";
import { Button } from "@/components/ui/button";

export default function LiveMapPage() {
  const filters = ["Still There", "Cleaned", "Hazardous"];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Live Litter Map"
        description="Monitor all reports across the city and identify high-density zones."
      />
      <div className="flex flex-wrap gap-4 mb-4">
        {filters.map((filter) => (
          <Button key={filter} variant="outline">
            {filter}
          </Button>
        ))}
      </div>
      <div className="flex-1">
        <GoogleMap />
      </div>
    </div>
  );
}
