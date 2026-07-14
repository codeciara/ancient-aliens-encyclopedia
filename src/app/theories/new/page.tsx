import { PageHeader } from "@/components/ui/page-header";
import { TheoryForm } from "@/components/forms/theory-form";
import { createTheory } from "@/lib/actions/theories";

export default function NewTheoryPage() {
  return (
    <div>
      <PageHeader title="Add New Theory" description="Add an ancient astronaut theory or thematic chapter" />
      <TheoryForm action={createTheory} submitLabel="Create Theory" />
    </div>
  );
}
