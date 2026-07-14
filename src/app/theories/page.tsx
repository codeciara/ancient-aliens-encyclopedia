import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getTheories } from "@/lib/actions/theories";
import { PublicationStatus } from "@/types";

export default async function TheoriesPage() {
  const theories = await getTheories();

  return (
    <div>
      <PageHeader
        title="Theories & Themes"
        description={`${theories.length} theories`}
        action={<Link href="/theories/new"><Button size="md"><Plus className="h-4 w-4" />Add Theory</Button></Link>}
      />
      {theories.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No theories yet" description="Add ancient astronaut theories, lost civilization hypotheses, and thematic chapters." action={<Link href="/theories/new"><Button>Add First Theory</Button></Link>} />
      ) : (
        <div className="space-y-2">
          {theories.map((theory) => (
            <Link key={theory.id} href={`/theories/${theory.slug}`}>
              <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-charcoal text-sm">{theory.title}</span>
                    {theory._count.claims > 0 && <span className="ml-2 text-xs text-charcoal-lighter">{theory._count.claims} claims</span>}
                  </div>
                  <StatusBadge status={theory.status as PublicationStatus} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
