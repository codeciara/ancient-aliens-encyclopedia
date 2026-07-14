"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface EpisodeFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    title: string;
    seasonNumber: number;
    episodeNumber: number;
    originalAirDate: string | null;
    summary: string | null;
    centralQuestion: string | null;
    mainSubjects: string | null;
    conventionalExplanations: string | null;
    internalNotes: string | null;
    status: string;
  };
  submitLabel?: string;
}

export function EpisodeForm({ action, initialData, submitLabel = "Create Episode" }: EpisodeFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {/* Core Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Title"
          name="title"
          defaultValue={initialData?.title}
          error={errors?.title?.[0]}
          required
          placeholder="The Evidence"
        />
        <Input
          label="Season"
          name="seasonNumber"
          type="number"
          min={1}
          defaultValue={initialData?.seasonNumber || 1}
          error={errors?.seasonNumber?.[0]}
          required
        />
        <Input
          label="Episode"
          name="episodeNumber"
          type="number"
          min={1}
          defaultValue={initialData?.episodeNumber || 1}
          error={errors?.episodeNumber?.[0]}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Original Air Date"
          name="originalAirDate"
          type="date"
          defaultValue={initialData?.originalAirDate || ""}
          hint="Date the episode first aired"
        />
        <Select
          label="Status"
          name="status"
          defaultValue={initialData?.status || "DRAFT"}
          options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))}
        />
      </div>

      {/* Content Fields */}
      <Textarea
        label="Original Summary"
        name="summary"
        defaultValue={initialData?.summary || ""}
        hint="Write an original summary - do not copy copyrighted descriptions"
        rows={4}
      />

      <Textarea
        label="Central Question"
        name="centralQuestion"
        defaultValue={initialData?.centralQuestion || ""}
        hint="The main question explored in this episode"
        rows={2}
      />

      <Textarea
        label="Main Subjects"
        name="mainSubjects"
        defaultValue={initialData?.mainSubjects || ""}
        hint="Key topics covered (comma-separated or one per line)"
        rows={3}
      />

      <Textarea
        label="Conventional Explanations"
        name="conventionalExplanations"
        defaultValue={initialData?.conventionalExplanations || ""}
        hint="Mainstream academic perspectives on the topics discussed"
        rows={3}
      />

      <Textarea
        label="Internal Notes"
        name="internalNotes"
        defaultValue={initialData?.internalNotes || ""}
        hint="Private notes - will not be exported to the book"
        rows={2}
      />

      {/* Actions */}
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
