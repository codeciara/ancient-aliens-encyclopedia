"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Source {
  id: string;
  title: string;
  author: string | null;
}

interface CitationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  sources: Source[];
  parentType: string;
  parentId: string;
  onCancel?: () => void;
}

export function CitationForm({ action, sources, parentType, parentId, onCancel }: CitationFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;
  const success = (state as { success?: boolean })?.success;

  const sourceOptions = sources.map((s) => ({
    value: s.id,
    label: s.author ? `${s.title} (${s.author})` : s.title,
  }));

  if (success) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
        Citation added successfully.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 p-4 bg-parchment rounded-lg border border-parchment-darker">
      <h4 className="font-heading text-sm text-charcoal">Add Citation</h4>

      {/* Hidden parent reference */}
      <input type="hidden" name={`${parentType}Id`} value={parentId} />

      <Select
        label="Source"
        name="sourceId"
        options={sourceOptions}
        placeholder="Select a source..."
        error={errors?.sourceId?.[0]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Page Numbers"
          name="pageNumbers"
          placeholder="42-45"
        />
        <Input
          label="Chapter"
          name="chapter"
          placeholder="Chapter 3"
        />
      </div>

      <Textarea
        label="Relevant Quote (brief, attributed)"
        name="quote"
        rows={2}
        hint="Keep brief - do not reproduce long copyrighted passages"
      />

      <Input
        label="Note"
        name="note"
        placeholder="Additional context about this citation"
      />

      <Input
        label="Access Date"
        name="accessDate"
        type="date"
        hint="For web sources"
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={isPending}>
          Add Citation
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
