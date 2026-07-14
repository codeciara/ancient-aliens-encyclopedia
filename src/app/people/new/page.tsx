import { PageHeader } from "@/components/ui/page-header";
import { PersonForm } from "@/components/forms/person-form";
import { createPerson } from "@/lib/actions/people";

export default function NewPersonPage() {
  return (
    <div>
      <PageHeader title="Add New Person" description="Add a researcher, commentator, or historical figure" />
      <PersonForm action={createPerson} submitLabel="Create Person" />
    </div>
  );
}
