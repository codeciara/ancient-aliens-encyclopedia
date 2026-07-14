"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface EntryFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    title: string;
    alternateNames: string | null;
    category: string | null;
    briefOverview: string | null;
    historicalBackground: string | null;
    ancientAstronautView: string | null;
    mainstreamView: string | null;
    evidenceCited: string | null;
    unresolvedQuestions: string | null;
    internalNotes: string | null;
    status: string;
  };
  submitLabel?: string;
}

export function EntryForm({ action, initialData, submitLabel = "Create Entry" }: EntryFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          name="title"
          defaultValue={initialData?.title}
          error={errors?.title?.[0]}
          required
          placeholder="The Great Pyramid of Giza"
        />
        <Select
          label="Status"
          name="status"
          defaultValue={initialData?.status || "DRAFT"}
          options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))}
        />
      </div>

      <Input
        label="Alternate Names"
        name="alternateNames"
        defaultValue={initialData?.alternateNames || ""}
        hint="Comma-separated alternate names or spellings"
        placeholder="Pyramid of Khufu, Pyramid of Cheops"
      />

      <Input
        label="Category"
        name="category"
        defaultValue={initialData?.category || ""}
        placeholder="Monument, Artifact, Concept, Location, Civilization..."
      />

      <Textarea
        label="Brief Overview"
        name="briefOverview"
        defaultValue={initialData?.briefOverview || ""}
        rows={3}
      />

      <Textarea
        label="Historical Background"
        name="historicalBackground"
        defaultValue={initialData?.historicalBackground || ""}
        rows={4}
      />

      <Textarea
        label="Ancient Astronaut Interpretation"
        name="ancientAstronautView"
        defaultValue={initialData?.ancientAstronautView || ""}
        hint="The ancient astronaut theory perspective on this topic"
        rows={4}
      />

      <Textarea
        label="Mainstream Scholarly Interpretation"
        name="mainstreamView"
        defaultValue={initialData?.mainstreamView || ""}
        hint="The conventional academic/archaeological perspective"
        rows={4}
      />

      <Textarea
        label="Evidence Commonly Cited"
        name="evidenceCited"
        defaultValue={initialData?.evidenceCited || ""}
        rows={3}
      />

      <Textarea
        label="Unresolved Questions"
        name="unresolvedQuestions"
        defaultValue={initialData?.unresolvedQuestions || ""}
        rows={3}
      />

      <Textarea
        label="Internal Notes"
        name="internalNotes"
        defaultValue={initialData?.internalNotes || ""}
        hint="Private notes - will not be exported to the book"
        rows={2}
      />

      <div className="flex gap-3 pt-4 border-t border-parchment-darker">
        <Button type="submit" loading={isPending}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
