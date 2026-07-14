"use client";

import { Card, CardHeader } from "@/components/ui/card";

interface EditionSettingsProps {
  edition: {
    id: string;
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
  };
}

const PAGE_SIZE_LABELS: Record<string, string> = {
  US_LETTER: "US Letter (8.5 x 11 in)",
  TRIM_6x9: "Trim 6 x 9 in",
  A4: "A4 (210 x 297 mm)",
};

export function EditionSettings({ edition }: EditionSettingsProps) {
  return (
    <Card padding="sm">
      <CardHeader title="Edition Settings" />
      <div className="space-y-2 text-xs">
        {edition.author && (
          <div className="flex justify-between">
            <span className="text-charcoal-lighter">Author</span>
            <span className="text-charcoal font-medium">{edition.author}</span>
          </div>
        )}
        {edition.publisher && (
          <div className="flex justify-between">
            <span className="text-charcoal-lighter">Publisher</span>
            <span className="text-charcoal font-medium">{edition.publisher}</span>
          </div>
        )}
        {edition.isbn && (
          <div className="flex justify-between">
            <span className="text-charcoal-lighter">ISBN</span>
            <span className="text-charcoal font-mono">{edition.isbn}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-charcoal-lighter">Page Size</span>
          <span className="text-charcoal">{PAGE_SIZE_LABELS[edition.pageSize] || edition.pageSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-lighter">Margins</span>
          <span className="text-charcoal">{edition.marginPreset}{edition.mirroredMargins ? " (mirrored)" : ""}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-lighter">Bleed</span>
          <span className="text-charcoal">{edition.bleedMm}mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-lighter">Format</span>
          <span className="text-charcoal font-medium">{edition.outputFormat}</span>
        </div>
      </div>
    </Card>
  );
}
