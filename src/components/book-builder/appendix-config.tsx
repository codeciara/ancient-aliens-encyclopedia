"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { toggleAppendix } from "@/lib/actions/book-editions";

interface AppendixItem {
  id: string;
  type: string;
  sortOrder: number;
  isIncluded: boolean;
}

interface AppendixConfigProps {
  editionId: string;
  items: AppendixItem[];
}

const APPENDIX_LABELS: Record<string, string> = {
  TIMELINE: "Chronological Timeline",
  EPISODE_INDEX: "Episode Index",
  SUBJECT_INDEX: "Subject Index",
  LOCATION_INDEX: "Location Index",
  CIVILIZATION_INDEX: "Civilization Index",
  RESEARCHER_INDEX: "Researcher Index",
  ARTIFACT_INDEX: "Artifact Index",
  DEITY_INDEX: "Deity Index",
  ANCIENT_TEXT_INDEX: "Ancient Text Index",
  BIBLIOGRAPHY: "Bibliography",
  IMAGE_CREDITS: "Image Credits",
  GLOSSARY: "Glossary",
};

export function AppendixConfig({ editionId, items }: AppendixConfigProps) {
  return (
    <Card padding="sm">
      <CardHeader title="Appendices" description="Back matter and indexes" />
      <div className="space-y-1">
        {items.map((item) => (
          <form key={item.id} action={async () => { await toggleAppendix(editionId, item.id, !item.isIncluded); }}>
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
              <span className="text-xs">{APPENDIX_LABELS[item.type] || item.type}</span>
            </button>
          </form>
        ))}
      </div>
    </Card>
  );
}
