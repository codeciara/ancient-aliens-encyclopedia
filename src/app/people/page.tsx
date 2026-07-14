import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getPeople } from "@/lib/actions/people";
import { PublicationStatus } from "@/types";

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <div>
      <PageHeader
        title="People & Researchers"
        description={`${people.length} profiles`}
        action={
          <Link href="/people/new">
            <Button size="md"><Plus className="h-4 w-4" />Add Person</Button>
          </Link>
        }
      />
      {people.length === 0 ? (
        <EmptyState icon={Users} title="No people yet" description="Add researchers, commentators, and historical figures." action={<Link href="/people/new"><Button>Add First Person</Button></Link>} />
      ) : (
        <div className="space-y-2">
          {people.map((person) => (
            <Link key={person.id} href={`/people/${person.slug}`}>
              <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-charcoal text-sm">{person.name}</span>
                    {person._count.episodePeople > 0 && (
                      <span className="ml-2 text-xs text-charcoal-lighter">{person._count.episodePeople} episodes</span>
                    )}
                  </div>
                  <StatusBadge status={person.status as PublicationStatus} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
