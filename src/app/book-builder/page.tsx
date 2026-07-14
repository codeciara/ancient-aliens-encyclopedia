import Link from "next/link";
import { BookMarked, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getEditions } from "@/lib/actions/book-editions";
import { PublicationStatus } from "@/types";

export default async function BookBuilderPage() {
  const editions = await getEditions();

  return (
    <div>
      <PageHeader
        title="Book Builder"
        description={`${editions.length} edition${editions.length !== 1 ? "s" : ""}`}
        action={
          <Link href="/book-builder/new">
            <Button size="md"><Plus className="h-4 w-4" />New Edition</Button>
          </Link>
        }
      />

      {editions.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No editions yet"
          description="Create your first book edition to start organizing content for publication."
          action={<Link href="/book-builder/new"><Button>Create First Edition</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editions.map((edition) => (
            <Link key={edition.id} href={`/book-builder/${edition.id}`}>
              <Card className="hover:border-gold transition-colors cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading text-base text-charcoal">{edition.title}</h3>
                      {edition.subtitle && (
                        <p className="text-xs text-charcoal-lighter mt-0.5">{edition.subtitle}</p>
                      )}
                    </div>
                    <StatusBadge status={edition.status as PublicationStatus} />
                  </div>

                  {edition.description && (
                    <p className="text-sm text-charcoal-lighter line-clamp-2 mb-3">{edition.description}</p>
                  )}

                  <div className="mt-auto pt-3 border-t border-parchment-darker flex items-center justify-between text-xs text-charcoal-lighter">
                    <div className="flex gap-3">
                      <span>{edition._count.chapters} chapters</span>
                      <span>{edition._count.frontMatter} front matter</span>
                      <span>{edition._count.appendices} appendices</span>
                    </div>
                    <span className="uppercase text-[10px] font-semibold">{edition.outputFormat}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
