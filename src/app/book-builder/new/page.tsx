import { PageHeader } from "@/components/ui/page-header";
import { EditionForm } from "@/components/forms/edition-form";
import { createEdition } from "@/lib/actions/book-editions";

export default function NewEditionPage() {
  return (
    <div>
      <PageHeader
        title="Create New Edition"
        description="Set up a new book edition for publication"
      />
      <EditionForm action={createEdition} submitLabel="Create Edition" />
    </div>
  );
}
