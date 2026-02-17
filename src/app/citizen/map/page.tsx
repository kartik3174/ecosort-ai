import { PageHeader } from "@/components/shared/page-header";
import { GoogleMap } from "@/components/shared/google-map";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const filters = ["Still There", "Cleaned", "Hazardous", "Recyclable"];
  const pinColors: Record<string, string> = {
      "Still There": "bg-red-500",
      "Cleaned": "bg-green-500",
      "Hazardous": "bg-yellow-500",
      "Recyclable": "bg-blue-500",
  }

  return (
    <div>
      <PageHeader
        title="Litter Map"
        description="View real-time litter reports across Chennai."
      />
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
            <Button key={filter} variant="outline">
                <span className={cn("w-3 h-3 rounded-full mr-2", pinColors[filter])}></span>
                {filter}
            </Button>
            ))}
        </div>
        <Button disabled>
            <MapPin /> Get Directions
        </Button>
      </div>
      <GoogleMap />
    </div>
  );
}
