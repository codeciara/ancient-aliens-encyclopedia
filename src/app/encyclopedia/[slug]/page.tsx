import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getEntryBySlug, deleteEntry, updateEntry } from "@/lib/actions/encyclopedia";
import { EntryForm } from "@/components/forms/entry-form";
import { PublicationStatus } from "@/types";

interface EntryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function EntryPage({ params, searchParams }: EntryPageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const entry = await getEntryBySlug(slug);

  if (!entry) notFound();

  const isEditing = edit === "true";

  if (isEditing) {
    const updateAction = updateEntry.bind(null, slug);
    return (
      <div>
        <PageHeader title={`Edit: ${entry.title}`} />
        <EntryForm action={updateAction} initialData={entry} submitLabel="Save Changes" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/encyclopedia" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Encyclopedia
        </Link>
      </div>

      <PageHeader
        title={entry.title}
        description={entry.category || undefined}
        action={
          <div className="flex gap-2">
            <Link href={`/encyclopedia/${slug}?edit=true`}>
              <Button variant="secondary" size="sm"><Edit className="h-3.5 w-3.5" /> Edit</Button>
            </Link>
            <form action={async () => { "use server"; await deleteEntry(slug); }}>
              <Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {entry.briefOverview && (
            <Card><CardHeader title="Overview" /><p className="text-sm whitespace-pre-wrap">{entry.briefOverview}</p></Card>
          )}
          {entry.historicalBackground && (
            <Card><CardHeader title="Historical Background" /><p className="text-sm whitespace-pre-wrap">{entry.historicalBackground}</p></Card>
          )}
          {entry.ancientAstronautView && (
            <Card><CardHeader title="Ancient Astronaut Interpretation" /><p className="text-sm whitespace-pre-wrap">{entry.ancientAstronautView}</p></Card>
          )}
          {entry.mainstreamView && (
            <Card><CardHeader title="Mainstream Scholarly Interpretation" /><p className="text-sm whitespace-pre-wrap">{entry.mainstreamView}</p></Card>
          )}
          {entry.evidenceCited && (
            <Card><CardHeader title="Evidence Commonly Cited" /><p className="text-sm whitespace-pre-wrap">{entry.evidenceCited}</p></Card>
          )}
          {entry.unresolvedQuestions && (
            <Card><CardHeader title="Unresolved Questions" /><p className="text-sm whitespace-pre-wrap">{entry.unresolvedQuestions}</p></Card>
          )}
        </div>

        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-charcoal-lighter">Status</span>
                <StatusBadge status={entry.status as PublicationStatus} />
              </div>
              {entry.alternateNames && (
                <div>
                  <span className="text-xs text-charcoal-lighter block">Alternate Names</span>
                  <span className="text-xs text-charcoal">{entry.alternateNames}</span>
                </div>
              )}
            </div>
          </Card>

          {entry.episodeEntries.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">Related Episodes</h4>
              <div className="space-y-1">
                {entry.episodeEntries.map((ee) => (
                  <Link key={ee.episodeId} href={`/episodes/${ee.episode.slug}`} className="block text-sm text-deep-blue hover:underline">
                    S{ee.episode.seasonNumber}E{ee.episode.episodeNumber}: {ee.episode.title}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {entry.internalNotes && (
            <Card padding="sm" className="bg-amber-50 border-amber-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4>
              <p className="text-xs text-amber-900 whitespace-pre-wrap">{entry.internalNotes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
