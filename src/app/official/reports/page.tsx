import { PageHeader } from "@/components/shared/page-header";
import { ReportCard } from "@/components/official/report-card";
import { allReportsData } from "@/lib/data";

export default function ReportsManagementPage() {
  return (
    <div>
      <PageHeader
        title="Incoming Reports"
        description="Manage and take action on new citizen submissions."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allReportsData.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>
    </div>
  );
}
