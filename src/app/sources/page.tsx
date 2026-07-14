import Link from "next/link";
import { Library, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getSources } from "@/lib/actions/sources";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <div>
      <PageHeader
        title="Sources & Bibliography"
        description={`${sources.length} sources`}
        action={
          <Link href="/sources/new">
            <Button size="md"><Plus className="h-4 w-4" />Add Source</Button>
          </Link>
        }
      />
      {sources.length === 0 ? (
        <EmptyState icon={Library} title="No sources yet" description="Add books, journals, websites, and other reference materials." action={<Link href="/sources/new"><Button>Add First Source</Button></Link>} />
      ) : (
        <div className="space-y-2">
          {sources.map((source) => (
            <Card key={source.id} padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-charcoal text-sm">{source.title}</span>
                  {source.author && <span className="ml-2 text-xs text-charcoal-lighter">by {source.author}</span>}
                  {source.publicationYear && <span className="text-xs text-charcoal-lighter ml-1">({source.publicationYear})</span>}
                </div>
                <span className="text-xs text-charcoal-lighter">{source._count.citations} citations</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
