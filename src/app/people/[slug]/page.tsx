import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPersonBySlug, deletePerson, updatePerson } from "@/lib/actions/people";
import { PersonForm } from "@/components/forms/person-form";
import { PublicationStatus } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function PersonPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  if (edit === "true") {
    const updateAction = updatePerson.bind(null, slug);
    return (
      <div>
        <PageHeader title={`Edit: ${person.name}`} />
        <PersonForm action={updateAction} initialData={person} submitLabel="Save Changes" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/people" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to People
        </Link>
      </div>
      <PageHeader
        title={person.name}
        action={
          <div className="flex gap-2">
            <Link href={`/people/${slug}?edit=true`}><Button variant="secondary" size="sm"><Edit className="h-3.5 w-3.5" /> Edit</Button></Link>
            <form action={async () => { "use server"; await deletePerson(slug); }}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {person.biography && (<Card><CardHeader title="Biography" /><p className="text-sm whitespace-pre-wrap">{person.biography}</p></Card>)}
          {person.mainTheories && (<Card><CardHeader title="Main Theories" /><p className="text-sm whitespace-pre-wrap">{person.mainTheories}</p></Card>)}
          {person.publishedWorks && (<Card><CardHeader title="Published Works" /><p className="text-sm whitespace-pre-wrap">{person.publishedWorks}</p></Card>)}
          {person.supportAndCriticism && (<Card><CardHeader title="Support & Criticism" /><p className="text-sm whitespace-pre-wrap">{person.supportAndCriticism}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={person.status as PublicationStatus} /></div>
            </div>
          </Card>
          {person.episodePeople.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">Episodes</h4>
              <div className="space-y-1">
                {person.episodePeople.map((ep) => (
                  <Link key={ep.episodeId} href={`/episodes/${ep.episode.slug}`} className="block text-sm text-deep-blue hover:underline">
                    S{ep.episode.seasonNumber}E{ep.episode.episodeNumber}: {ep.episode.title}
                  </Link>
                ))}
              </div>
            </Card>
          )}
          {person.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{person.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
