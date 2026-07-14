import { Tag as TagIcon, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { entities: true } } },
  });

  return (
    <div>
      <PageHeader title="Tags" description={`${tags.length} tags`} />
      {tags.length === 0 ? (
        <EmptyState icon={TagIcon} title="No tags yet" description="Tags will be created as you tag content entries." />
      ) : (
        <Card>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} className="bg-parchment text-charcoal border border-parchment-darker">
                {tag.name}
                <span className="ml-1 text-charcoal-lighter">({tag._count.entities})</span>
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
