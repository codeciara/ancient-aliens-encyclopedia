import { Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";

export default async function TimelinePage() {
  const events = await prisma.timelineEvent.findMany({ orderBy: { sortYear: "asc" } });

  return (
    <div>
      <PageHeader title="Chronological Timeline" description={`${events.length} events`} />
      {events.length === 0 ? (
        <EmptyState icon={Clock} title="No timeline events yet" description="Timeline events will appear here as they are added to the database." />
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id} padding="sm">
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono text-gold font-semibold whitespace-nowrap min-w-[80px]">{event.dateDisplay}</span>
                <div>
                  <p className="text-sm font-medium text-charcoal">{event.title}</p>
                  {event.description && <p className="text-xs text-charcoal-lighter mt-0.5">{event.description}</p>}
                </div>
                {event.category && <span className="ml-auto text-xs text-charcoal-lighter">{event.category}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
