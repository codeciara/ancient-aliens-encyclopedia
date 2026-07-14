"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface TheoryFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    title: string;
    overview: string | null;
    historicalContext: string | null;
    keyArguments: string | null;
    supportingEvidence: string | null;
    counterArguments: string | null;
    relatedTexts: string | null;
    internalNotes: string | null;
    status: string;
  };
  submitLabel?: string;
}

export function TheoryForm({ action, initialData, submitLabel = "Create Theory" }: TheoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Title" name="title" defaultValue={initialData?.title} error={errors?.title?.[0]} required placeholder="Ancient Astronaut Theory" />
        <Select label="Status" name="status" defaultValue={initialData?.status || "DRAFT"} options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))} />
      </div>
      <Textarea label="Overview" name="overview" defaultValue={initialData?.overview || ""} rows={4} />
      <Textarea label="Historical Context" name="historicalContext" defaultValue={initialData?.historicalContext || ""} rows={3} />
      <Textarea label="Key Arguments" name="keyArguments" defaultValue={initialData?.keyArguments || ""} rows={4} />
      <Textarea label="Supporting Evidence" name="supportingEvidence" defaultValue={initialData?.supportingEvidence || ""} rows={3} />
      <Textarea label="Counter Arguments" name="counterArguments" defaultValue={initialData?.counterArguments || ""} rows={3} />
      <Textarea label="Related Texts" name="relatedTexts" defaultValue={initialData?.relatedTexts || ""} hint="Ancient texts cited in support" rows={2} />
      <Textarea label="Internal Notes" name="internalNotes" defaultValue={initialData?.internalNotes || ""} hint="Private - not exported" rows={2} />
      <div className="flex gap-3 pt-4 border-t border-parchment-darker">
        <Button type="submit" loading={isPending}>{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
