import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getLocationBySlug, deleteLocation, updateLocation } from "@/lib/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { PublicationStatus } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function LocationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const isEditing = edit === "true";

  if (isEditing) {
    const updateAction = updateLocation.bind(null, slug);
    return (
      <div>
        <PageHeader title={`Edit: ${location.name}`} />
        <LocationForm action={updateAction} initialData={location} submitLabel="Save Changes" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/locations" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Locations
        </Link>
      </div>
      <PageHeader
        title={location.name}
        description={[location.country, location.region].filter(Boolean).join(", ") || undefined}
        action={
          <div className="flex gap-2">
            <Link href={`/locations/${slug}?edit=true`}><Button variant="secondary" size="sm"><Edit className="h-3.5 w-3.5" /> Edit</Button></Link>
            <form action={async () => { "use server"; await deleteLocation(slug); }}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {location.description && (<Card><CardHeader title="Description" /><p className="text-sm whitespace-pre-wrap">{location.description}</p></Card>)}
          {location.archaeologicalConsensus && (<Card><CardHeader title="Archaeological Consensus" /><p className="text-sm whitespace-pre-wrap">{location.archaeologicalConsensus}</p></Card>)}
          {location.ancientAstronautView && (<Card><CardHeader title="Ancient Astronaut Interpretation" /><p className="text-sm whitespace-pre-wrap">{location.ancientAstronautView}</p></Card>)}
          {location.unresolvedQuestions && (<Card><CardHeader title="Unresolved Questions" /><p className="text-sm whitespace-pre-wrap">{location.unresolvedQuestions}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={location.status as PublicationStatus} /></div>
              {location.historicalPeriod && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Period</span><span className="text-xs text-charcoal">{location.historicalPeriod}</span></div>)}
              {location.latitude && location.longitude && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Coordinates</span><span className="text-xs text-charcoal font-mono">{location.latitude}°, {location.longitude}°</span></div>)}
              {location.knownBuilders && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Builders</span><span className="text-xs text-charcoal">{location.knownBuilders}</span></div>)}
            </div>
          </Card>
          {location.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{location.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
