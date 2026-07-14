import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getEntries } from "@/lib/actions/encyclopedia";
import { PublicationStatus } from "@/types";

export default async function EncyclopediaPage() {
  const entries = await getEntries();

  // Group alphabetically
  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    const letter = entry.title[0]?.toUpperCase() || "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(entry);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="A-Z Encyclopedia"
        description={`${entries.length} entries`}
        action={
          <Link href="/encyclopedia/new">
            <Button size="md">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </Link>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No encyclopedia entries yet"
          description="Start building your encyclopedia by adding the first entry."
          action={
            <Link href="/encyclopedia/new">
              <Button>Add First Entry</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Alphabetical Index */}
          <div className="flex flex-wrap gap-1">
            {Object.keys(grouped).sort().map((letter) => (
              <a key={letter} href={`#letter-${letter}`} className="px-2 py-1 text-sm font-medium text-deep-blue hover:bg-parchment rounded">
                {letter}
              </a>
            ))}
          </div>

          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, letterEntries]) => (
              <div key={letter} id={`letter-${letter}`}>
                <h2 className="font-display text-2xl text-gold border-b border-parchment-darker pb-1 mb-3">
                  {letter}
                </h2>
                <div className="space-y-2">
                  {letterEntries.map((entry) => (
                    <Link key={entry.id} href={`/encyclopedia/${entry.slug}`}>
                      <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-charcoal text-sm">{entry.title}</span>
                            {entry.category && (
                              <span className="ml-2 text-xs text-charcoal-lighter">({entry.category})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={entry.status as PublicationStatus} />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
