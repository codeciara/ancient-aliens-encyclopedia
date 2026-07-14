import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EvidenceTypeBadge, EvidenceLevelBadge } from "@/components/ui/evidence-badge";
import { getEpisodeBySlug, deleteEpisode, updateEpisode } from "@/lib/actions/episodes";
import { PublicationStatus, EvidenceType } from "@/types";
import { EpisodeForm } from "@/components/forms/episode-form";

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function EpisodePage({ params, searchParams }: EpisodePageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const episode = await getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const isEditing = edit === "true";

  if (isEditing) {
    const updateAction = updateEpisode.bind(null, slug);
    return (
      <div>
        <PageHeader
          title={`Edit: ${episode.title}`}
          description={`S${episode.seasonNumber.toString().padStart(2, "0")}E${episode.episodeNumber.toString().padStart(2, "0")}`}
        />
        <EpisodeForm
          action={updateAction}
          initialData={episode}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/episodes" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal transition-colors">
          <ArrowLeft className="h-3 w-3" />
          Back to Episodes
        </Link>
      </div>

      <PageHeader
        title={episode.title}
        description={`Season ${episode.seasonNumber}, Episode ${episode.episodeNumber}`}
        action={
          <div className="flex gap-2">
            <Link href={`/episodes/${slug}?edit=true`}>
              <Button variant="secondary" size="sm">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <form action={async () => { "use server"; await deleteEpisode(slug); }}>
              <Button variant="danger" size="sm" type="submit">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {episode.summary && (
            <Card>
              <CardHeader title="Original Summary" />
              <p className="text-sm text-charcoal whitespace-pre-wrap">{episode.summary}</p>
            </Card>
          )}

          {/* Central Question */}
          {episode.centralQuestion && (
            <Card>
              <CardHeader title="Central Question" />
              <p className="text-sm text-charcoal italic">{episode.centralQuestion}</p>
            </Card>
          )}

          {/* Claims */}
          {episode.claims.length > 0 && (
            <Card>
              <CardHeader title={`Claims (${episode.claims.length})`} />
              <div className="space-y-3">
                {episode.claims.map((claim) => (
                  <div key={claim.id} className="border border-parchment-darker rounded p-3">
                    <p className="text-sm text-charcoal mb-2">{claim.statement}</p>
                    <div className="flex gap-2 flex-wrap">
                      <EvidenceTypeBadge type={claim.evidenceType as EvidenceType} />
                      <EvidenceLevelBadge level={claim.contextLevel} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conventional Explanations */}
          {episode.conventionalExplanations && (
            <Card>
              <CardHeader title="Conventional Explanations" />
              <p className="text-sm text-charcoal whitespace-pre-wrap">{episode.conventionalExplanations}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Meta */}
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-charcoal-lighter">Status</span>
                <StatusBadge status={episode.status as PublicationStatus} />
              </div>
              {episode.originalAirDate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-charcoal-lighter">Air Date</span>
                  <span className="text-xs font-medium text-charcoal">{episode.originalAirDate}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-charcoal-lighter">Slug</span>
                <span className="text-xs font-mono text-charcoal-lighter">{episode.slug}</span>
              </div>
            </div>
          </Card>

          {/* Related People */}
          {episode.episodePeople.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">
                People
              </h4>
              <div className="space-y-1">
                {episode.episodePeople.map((ep) => (
                  <Link key={ep.personId} href={`/people/${ep.person.slug}`} className="block text-sm text-deep-blue hover:underline">
                    {ep.person.name}
                    {ep.role && <span className="text-charcoal-lighter"> ({ep.role})</span>}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Related Locations */}
          {episode.episodeLocations.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">
                Locations
              </h4>
              <div className="space-y-1">
                {episode.episodeLocations.map((el) => (
                  <Link key={el.locationId} href={`/locations/${el.location.slug}`} className="block text-sm text-deep-blue hover:underline">
                    {el.location.name}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Related Entries */}
          {episode.episodeEntries.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">
                Encyclopedia Entries
              </h4>
              <div className="space-y-1">
                {episode.episodeEntries.map((ee) => (
                  <Link key={ee.entryId} href={`/encyclopedia/${ee.entry.slug}`} className="block text-sm text-deep-blue hover:underline">
                    {ee.entry.title}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Internal Notes */}
          {episode.internalNotes && (
            <Card padding="sm" className="bg-amber-50 border-amber-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                Internal Notes
              </h4>
              <p className="text-xs text-amber-900 whitespace-pre-wrap">{episode.internalNotes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
