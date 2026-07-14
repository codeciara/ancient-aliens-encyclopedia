"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { toggleFrontMatter } from "@/lib/actions/book-editions";

interface FrontMatterItem {
  id: string;
  type: string;
  sortOrder: number;
  isIncluded: boolean;
}

interface FrontMatterConfigProps {
  editionId: string;
  items: FrontMatterItem[];
}

const FRONT_MATTER_LABELS: Record<string, string> = {
  COVER: "Cover",
  TITLE_PAGE: "Title Page",
  COPYRIGHT: "Copyright Page",
  DISCLAIMER: "Independent Publication Disclaimer",
  DEDICATION: "Dedication",
  PREFACE: "Preface",
  INTRODUCTION: "Introduction",
  HOW_TO_USE: "How to Use This Book",
  EVIDENCE_EXPLANATION: "Evidence Label Explanation",
  TOC: "Table of Contents",
};

export function FrontMatterConfig({ editionId, items }: FrontMatterConfigProps) {
  return (
    <Card padding="sm">
      <CardHeader title="Front Matter" description="Pages before the main content" />
      <div className="space-y-1">
        {items.map((item) => (
          <form key={item.id} action={async () => { await toggleFrontMatter(editionId, item.id, !item.isIncluded); }}>
            <button
              type="submit"
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${
                item.isIncluded
                  ? "bg-parchment text-charcoal hover:bg-parchment-dark"
                  : "text-charcoal-lighter line-through hover:bg-parchment/50"
              }`}
            >
              <input
                type="checkbox"
                checked={item.isIncluded}
                readOnly
                className="h-3.5 w-3.5 rounded border-parchment-darker text-gold focus:ring-gold pointer-events-none"
              />
              <span className="text-xs">{FRONT_MATTER_LABELS[item.type] || item.type}</span>
            </button>
          </form>
        ))}
      </div>
    </Card>
  );
}
