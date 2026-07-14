"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface PersonFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    name: string;
    biography: string | null;
    mainTheories: string | null;
    publishedWorks: string | null;
    associatedTopics: string | null;
    supportAndCriticism: string | null;
    internalNotes: string | null;
    status: string;
  };
  submitLabel?: string;
}

export function PersonForm({ action, initialData, submitLabel = "Create Person" }: PersonFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Name" name="name" defaultValue={initialData?.name} error={errors?.name?.[0]} required placeholder="Giorgio A. Tsoukalos" />
        <Select label="Status" name="status" defaultValue={initialData?.status || "DRAFT"} options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))} />
      </div>
      <Textarea label="Biography" name="biography" defaultValue={initialData?.biography || ""} rows={4} />
      <Textarea label="Main Theories" name="mainTheories" defaultValue={initialData?.mainTheories || ""} rows={3} />
      <Textarea label="Published Works" name="publishedWorks" defaultValue={initialData?.publishedWorks || ""} hint="Books, papers, or media produced" rows={3} />
      <Textarea label="Associated Topics" name="associatedTopics" defaultValue={initialData?.associatedTopics || ""} hint="Key topics this person is known for" rows={2} />
      <Textarea label="Support & Criticism" name="supportAndCriticism" defaultValue={initialData?.supportAndCriticism || ""} rows={3} />
      <Textarea label="Internal Notes" name="internalNotes" defaultValue={initialData?.internalNotes || ""} hint="Private - not exported" rows={2} />
      <div className="flex gap-3 pt-4 border-t border-parchment-darker">
        <Button type="submit" loading={isPending}>{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
