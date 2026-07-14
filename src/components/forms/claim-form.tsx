"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EVIDENCE_TYPES, EVIDENCE_CONTEXT_LEVELS, EVIDENCE_TYPE_LABELS, EvidenceType } from "@/types";

interface ClaimFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  parentType: "episode" | "entry" | "theory";
  parentId: string;
  initialData?: {
    id: string;
    statement: string;
    evidenceType: string;
    contextLevel: number;
    explanation: string | null;
    sourceText: string | null;
    notes: string | null;
  };
  onCancel?: () => void;
}

export function ClaimForm({ action, parentType, parentId, initialData, onCancel }: ClaimFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;
  const success = (state as { success?: boolean })?.success;

  const evidenceTypeOptions = EVIDENCE_TYPES.map((t) => ({
    value: t,
    label: EVIDENCE_TYPE_LABELS[t as EvidenceType],
  }));

  const contextLevelOptions = EVIDENCE_CONTEXT_LEVELS.map((l) => ({
    value: l.value.toString(),
    label: `${l.value} — ${l.label}`,
  }));

  if (success) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
        Claim {initialData ? "updated" : "added"} successfully.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 p-4 bg-parchment rounded-lg border border-parchment-darker">
      <h4 className="font-heading text-sm text-charcoal">
        {initialData ? "Edit Claim" : "Add New Claim"}
      </h4>

      {/* Hidden parent reference */}
      <input type="hidden" name={`${parentType}Id`} value={parentId} />

      <Textarea
        label="Claim Statement"
        name="statement"
        defaultValue={initialData?.statement || ""}
        error={errors?.statement?.[0]}
        required
        rows={2}
        placeholder="The precision of the Great Pyramid's construction suggests advanced technology..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Evidence Type"
          name="evidenceType"
          defaultValue={initialData?.evidenceType || ""}
          options={evidenceTypeOptions}
          placeholder="Select type..."
          error={errors?.evidenceType?.[0]}
        />
        <Select
          label="Evidence Context Level"
          name="contextLevel"
          defaultValue={initialData?.contextLevel?.toString() || "1"}
          options={contextLevelOptions}
        />
      </div>

      <Textarea
        label="Explanation"
        name="explanation"
        defaultValue={initialData?.explanation || ""}
        rows={2}
        hint="Brief explanation of why this label applies"
      />

      <Input
        label="Source Text"
        name="sourceText"
        defaultValue={initialData?.sourceText || ""}
        hint="Brief citation or reference for this specific claim"
      />

      <Textarea
        label="Notes"
        name="notes"
        defaultValue={initialData?.notes || ""}
        rows={2}
        hint="Internal notes about this claim"
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={isPending}>
          {initialData ? "Update Claim" : "Add Claim"}
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
