import { PageHeader } from "@/components/ui/page-header";
import { EntryForm } from "@/components/forms/entry-form";
import { createEntry } from "@/lib/actions/encyclopedia";

export default function NewEntryPage() {
  return (
    <div>
      <PageHeader
        title="Add New Encyclopedia Entry"
        description="Create a new A-Z encyclopedia entry"
      />
      <EntryForm action={createEntry} submitLabel="Create Entry" />
    </div>
  );
}
