import Link from "next/link";
import { Gem, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

export default async function ArtifactsPage() {
  const artifacts = await prisma.artifact.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Artifacts" description={`${artifacts.length} artifacts`} action={<Link href="/artifacts/new"><Button size="md"><Plus className="h-4 w-4" />Add Artifact</Button></Link>} />
      {artifacts.length === 0 ? (
        <EmptyState icon={Gem} title="No artifacts yet" description="Add mysterious objects, out-of-place artifacts, and ancient technologies." action={<Link href="/artifacts/new"><Button>Add First Artifact</Button></Link>} />
      ) : (
        <div className="space-y-2">{artifacts.map((a) => (<Link key={a.id} href={`/artifacts/${a.slug}`}><Card padding="sm" className="hover:border-gold transition-colors cursor-pointer"><div className="flex items-center justify-between"><span className="font-medium text-charcoal text-sm">{a.name}</span><StatusBadge status={a.status as PublicationStatus} /></div></Card></Link>))}</div>
      )}
    </div>
  );
}
