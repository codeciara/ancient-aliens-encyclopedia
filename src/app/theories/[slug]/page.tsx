import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getTheoryBySlug, deleteTheory, updateTheory } from "@/lib/actions/theories";
import { TheoryForm } from "@/components/forms/theory-form";
import { PublicationStatus } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function TheoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const theory = await getTheoryBySlug(slug);
  if (!theory) notFound();

  if (edit === "true") {
    const updateAction = updateTheory.bind(null, slug);
    return (
      <div>
        <PageHeader title={`Edit: ${theory.title}`} />
        <TheoryForm action={updateAction} initialData={theory} submitLabel="Save Changes" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/theories" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Theories
        </Link>
      </div>
      <PageHeader
        title={theory.title}
        action={
          <div className="flex gap-2">
            <Link href={`/theories/${slug}?edit=true`}><Button variant="secondary" size="sm"><Edit className="h-3.5 w-3.5" /> Edit</Button></Link>
            <form action={async () => { "use server"; await deleteTheory(slug); }}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {theory.overview && (<Card><CardHeader title="Overview" /><p className="text-sm whitespace-pre-wrap">{theory.overview}</p></Card>)}
          {theory.historicalContext && (<Card><CardHeader title="Historical Context" /><p className="text-sm whitespace-pre-wrap">{theory.historicalContext}</p></Card>)}
          {theory.keyArguments && (<Card><CardHeader title="Key Arguments" /><p className="text-sm whitespace-pre-wrap">{theory.keyArguments}</p></Card>)}
          {theory.supportingEvidence && (<Card><CardHeader title="Supporting Evidence" /><p className="text-sm whitespace-pre-wrap">{theory.supportingEvidence}</p></Card>)}
          {theory.counterArguments && (<Card><CardHeader title="Counter Arguments" /><p className="text-sm whitespace-pre-wrap">{theory.counterArguments}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={theory.status as PublicationStatus} /></div>
            </div>
          </Card>
          {theory.personTheories.length > 0 && (
            <Card padding="sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">Associated People</h4>
              <div className="space-y-1">
                {theory.personTheories.map((pt) => (
                  <Link key={pt.personId} href={`/people/${pt.person.slug}`} className="block text-sm text-deep-blue hover:underline">
                    {pt.person.name} {pt.role && `(${pt.role})`}
                  </Link>
                ))}
              </div>
            </Card>
          )}
          {theory.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{theory.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
