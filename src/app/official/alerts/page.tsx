import { PageHeader } from "@/components/shared/page-header";
import { AlertCard } from "@/components/official/alert-card";
import { alertsData } from "@/lib/data";

export default function AlertsPage() {
  return (
    <div>
      <PageHeader
        title="Hazardous Waste Alerts"
        description="Priority notifications for immediate action."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alertsData.map((alert) => (
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  );
}
