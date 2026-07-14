import Link from "next/link";
import { Tv, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getEpisodes } from "@/lib/actions/episodes";
import { PublicationStatus } from "@/types";

export default async function EpisodesPage() {
  const episodes = await getEpisodes();

  // Group by season
  const seasons = episodes.reduce<Record<number, typeof episodes>>((acc, ep) => {
    if (!acc[ep.seasonNumber]) acc[ep.seasonNumber] = [];
    acc[ep.seasonNumber].push(ep);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Episode Guide"
        description={`${episodes.length} episodes across ${Object.keys(seasons).length} seasons`}
        action={
          <Link href="/episodes/new">
            <Button size="md">
              <Plus className="h-4 w-4" />
              Add Episode
            </Button>
          </Link>
        }
      />

      {episodes.length === 0 ? (
        <EmptyState
          icon={Tv}
          title="No episodes yet"
          description="Start building your episode guide by adding the first episode."
          action={
            <Link href="/episodes/new">
              <Button>Add First Episode</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(seasons)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([season, eps]) => (
              <div key={season}>
                <h2 className="font-heading text-lg text-charcoal mb-3">
                  Season {season}
                  <span className="text-sm font-normal text-charcoal-lighter ml-2">
                    ({eps.length} episodes)
                  </span>
                </h2>
                <div className="space-y-2">
                  {eps.map((ep) => (
                    <Link key={ep.id} href={`/episodes/${ep.slug}`}>
                      <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-charcoal-lighter w-12">
                              S{ep.seasonNumber.toString().padStart(2, "0")}E{ep.episodeNumber.toString().padStart(2, "0")}
                            </span>
                            <span className="font-medium text-charcoal text-sm">{ep.title}</span>
                            {ep.originalAirDate && (
                              <span className="text-xs text-charcoal-lighter">{ep.originalAirDate}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={ep.status as PublicationStatus} />
                            {ep._count.claims > 0 && (
                              <span className="text-xs text-charcoal-lighter">{ep._count.claims} claims</span>
                            )}
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
