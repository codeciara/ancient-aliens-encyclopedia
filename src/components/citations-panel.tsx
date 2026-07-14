"use client";

import { useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CitationForm } from "@/components/forms/citation-form";
import { createCitation, deleteCitation } from "@/lib/actions/citations";

interface Citation {
  id: string;
  pageNumbers: string | null;
  chapter: string | null;
  quote: string | null;
  note: string | null;
  source: { id: string; title: string; author: string | null };
}

interface Source {
  id: string;
  title: string;
  author: string | null;
}

interface CitationsPanelProps {
  citations: Citation[];
  sources: Source[];
  parentType: string;
  parentId: string;
}

export function CitationsPanel({ citations, sources, parentType, parentId }: CitationsPanelProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card>
      <CardHeader
        title={`Citations & Sources (${citations.length})`}
        description="Reference materials supporting this content"
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-3.5 w-3.5" />
            Add Citation
          </Button>
        }
      />

      {showForm && (
        <div className="mb-4">
          <CitationForm
            action={createCitation}
            sources={sources}
            parentType={parentType}
            parentId={parentId}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {citations.length === 0 && !showForm ? (
        <p className="text-sm text-charcoal-lighter italic">
          No citations yet. Add references to support factual claims.
        </p>
      ) : (
        <div className="space-y-2">
          {citations.map((citation) => (
            <div
              key={citation.id}
              className="flex items-start justify-between gap-2 border border-parchment-darker rounded p-2 bg-white"
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <BookOpen className="h-3.5 w-3.5 mt-0.5 text-sandstone flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {citation.source.title}
                  </p>
                  {citation.source.author && (
                    <p className="text-xs text-charcoal-lighter">{citation.source.author}</p>
                  )}
                  <div className="flex gap-3 mt-0.5 text-xs text-charcoal-lighter">
                    {citation.pageNumbers && <span>pp. {citation.pageNumbers}</span>}
                    {citation.chapter && <span>Ch. {citation.chapter}</span>}
                  </div>
                  {citation.quote && (
                    <p className="text-xs italic text-charcoal-lighter mt-1 line-clamp-2">
                      &ldquo;{citation.quote}&rdquo;
                    </p>
                  )}
                  {citation.note && (
                    <p className="text-xs text-charcoal-lighter mt-0.5">{citation.note}</p>
                  )}
                </div>
              </div>
              <form action={async () => { await deleteCitation(citation.id); }}>
                <button
                  type="submit"
                  className="text-charcoal-lighter hover:text-error transition-colors p-1"
                  title="Remove citation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
