import { PageHeader } from "@/components/shared/page-header";
import { TagLitterForm } from "@/components/citizen/tag-litter-form";

export default function TagLitterPage() {
  return (
    <div>
      <PageHeader
        title="Tag New Litter"
        description="Help us identify and clean up litter by submitting a report."
      />
      <TagLitterForm />
    </div>
  );
}
