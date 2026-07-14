"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface LocationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    name: string;
    country: string | null;
    region: string | null;
    latitude: number | null;
    longitude: number | null;
    civilization: string | null;
    historicalPeriod: string | null;
    knownBuilders: string | null;
    description: string | null;
    archaeologicalConsensus: string | null;
    ancientAstronautView: string | null;
    unresolvedQuestions: string | null;
    mapReference: string | null;
    internalNotes: string | null;
    status: string;
  };
  submitLabel?: string;
}

export function LocationForm({ action, initialData, submitLabel = "Create Location" }: LocationFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Name" name="name" defaultValue={initialData?.name} error={errors?.name?.[0]} required placeholder="Great Pyramid of Giza" />
        <Select label="Status" name="status" defaultValue={initialData?.status || "DRAFT"} options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Country" name="country" defaultValue={initialData?.country || ""} placeholder="Egypt" />
        <Input label="Region" name="region" defaultValue={initialData?.region || ""} placeholder="Giza Plateau" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Latitude" name="latitude" type="number" step="any" defaultValue={initialData?.latitude ?? ""} placeholder="29.9792" />
        <Input label="Longitude" name="longitude" type="number" step="any" defaultValue={initialData?.longitude ?? ""} placeholder="31.1342" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Civilization" name="civilization" defaultValue={initialData?.civilization || ""} placeholder="Ancient Egyptian" />
        <Input label="Historical Period" name="historicalPeriod" defaultValue={initialData?.historicalPeriod || ""} placeholder="c. 2560 BCE" />
      </div>
      <Input label="Known/Proposed Builders" name="knownBuilders" defaultValue={initialData?.knownBuilders || ""} />
      <Textarea label="Description" name="description" defaultValue={initialData?.description || ""} rows={4} />
      <Textarea label="Archaeological Consensus" name="archaeologicalConsensus" defaultValue={initialData?.archaeologicalConsensus || ""} rows={3} />
      <Textarea label="Ancient Astronaut Interpretation" name="ancientAstronautView" defaultValue={initialData?.ancientAstronautView || ""} rows={3} />
      <Textarea label="Unresolved Questions" name="unresolvedQuestions" defaultValue={initialData?.unresolvedQuestions || ""} rows={3} />
      <Input label="Map Reference" name="mapReference" defaultValue={initialData?.mapReference || ""} />
      <Textarea label="Internal Notes" name="internalNotes" defaultValue={initialData?.internalNotes || ""} hint="Private - not exported" rows={2} />
      <div className="flex gap-3 pt-4 border-t border-parchment-darker">
        <Button type="submit" loading={isPending}>{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
