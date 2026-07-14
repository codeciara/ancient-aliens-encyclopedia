"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PUBLICATION_STATUSES } from "@/types";

interface EditionFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: {
    title: string;
    subtitle: string | null;
    description: string | null;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    publicationDate: string | null;
    language: string;
    pageSize: string;
    marginPreset: string;
    mirroredMargins: boolean;
    bleedMm: number;
    outputFormat: string;
    status: string;
  };
  submitLabel?: string;
}

export function EditionForm({ action, initialData, submitLabel = "Create Edition" }: EditionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Edition Title"
          name="title"
          defaultValue={initialData?.title}
          error={errors?.title?.[0]}
          required
          placeholder="Volume 1: Essential Mysteries"
        />
        <Select
          label="Status"
          name="status"
          defaultValue={initialData?.status || "DRAFT"}
          options={PUBLICATION_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))}
        />
      </div>

      <Input
        label="Subtitle"
        name="subtitle"
        defaultValue={initialData?.subtitle || ""}
        placeholder="A Guide to the Episodes, Civilizations, Artifacts, Gods, Locations, and Theories"
      />

      <Textarea
        label="Description"
        name="description"
        defaultValue={initialData?.description || ""}
        rows={3}
        hint="Internal description of this edition's purpose and scope"
      />

      {/* Author & Publisher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Author"
          name="author"
          defaultValue={initialData?.author || ""}
          placeholder="Your name"
        />
        <Input
          label="Publisher"
          name="publisher"
          defaultValue={initialData?.publisher || ""}
          placeholder="Independent / Your imprint"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="ISBN"
          name="isbn"
          defaultValue={initialData?.isbn || ""}
          placeholder="978-0-000-00000-0"
          hint="Optional"
        />
        <Input
          label="Publication Date"
          name="publicationDate"
          type="date"
          defaultValue={initialData?.publicationDate || ""}
        />
        <Input
          label="Language"
          name="language"
          defaultValue={initialData?.language || "en"}
        />
      </div>

      {/* Page Layout */}
      <h3 className="font-heading text-sm text-charcoal pt-2 border-t border-parchment-darker">
        Page Layout
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Page Size"
          name="pageSize"
          defaultValue={initialData?.pageSize || "US_LETTER"}
          options={[
            { value: "US_LETTER", label: "US Letter (8.5 x 11 in)" },
            { value: "TRIM_6x9", label: "Trim 6 x 9 in" },
            { value: "A4", label: "A4 (210 x 297 mm)" },
          ]}
        />
        <Select
          label="Margin Preset"
          name="marginPreset"
          defaultValue={initialData?.marginPreset || "STANDARD"}
          options={[
            { value: "STANDARD", label: "Standard" },
            { value: "NARROW", label: "Narrow" },
            { value: "WIDE", label: "Wide" },
            { value: "PRINT", label: "Print (larger gutter)" },
          ]}
        />
        <Input
          label="Bleed (mm)"
          name="bleedMm"
          type="number"
          step="0.5"
          defaultValue={initialData?.bleedMm ?? 3.0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Output Format"
          name="outputFormat"
          defaultValue={initialData?.outputFormat || "PDF"}
          options={[
            { value: "PDF", label: "PDF" },
            { value: "EPUB", label: "EPUB" },
            { value: "BOTH", label: "Both PDF & EPUB" },
          ]}
        />
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="mirroredMargins"
            name="mirroredMargins"
            defaultChecked={initialData?.mirroredMargins ?? true}
            value="true"
            className="h-4 w-4 rounded border-parchment-darker text-gold focus:ring-gold"
          />
          <label htmlFor="mirroredMargins" className="text-sm text-charcoal">
            Mirrored margins (for print binding)
          </label>
        </div>
      </div>

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
