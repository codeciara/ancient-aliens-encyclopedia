import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getLocations } from "@/lib/actions/locations";
import { PublicationStatus } from "@/types";

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div>
      <PageHeader
        title="Locations & Travel Atlas"
        description={`${locations.length} locations`}
        action={<Link href="/locations/new"><Button size="md"><Plus className="h-4 w-4" />Add Location</Button></Link>}
      />
      {locations.length === 0 ? (
        <EmptyState icon={MapPin} title="No locations yet" description="Add ancient sites, monuments, and mysterious locations." action={<Link href="/locations/new"><Button>Add First Location</Button></Link>} />
      ) : (
        <div className="space-y-2">
          {locations.map((loc) => (
            <Link key={loc.id} href={`/locations/${loc.slug}`}>
              <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-charcoal text-sm">{loc.name}</span>
                    {loc.country && <span className="ml-2 text-xs text-charcoal-lighter">{loc.country}</span>}
                  </div>
                  <StatusBadge status={loc.status as PublicationStatus} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
