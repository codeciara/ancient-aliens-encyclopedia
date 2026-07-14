import Link from "next/link";
import { Flame, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

export default async function DeitiesPage() {
  const deities = await prisma.deity.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Deities & Sky Beings" description={`${deities.length} deities`} action={<Link href="/deities/new"><Button size="md"><Plus className="h-4 w-4" />Add Deity</Button></Link>} />
      {deities.length === 0 ? (
        <EmptyState icon={Flame} title="No deities yet" description="Add gods, sky beings, and divine figures from ancient traditions." action={<Link href="/deities/new"><Button>Add First Deity</Button></Link>} />
      ) : (
        <div className="space-y-2">{deities.map((d) => (<Link key={d.id} href={`/deities/${d.slug}`}><Card padding="sm" className="hover:border-gold transition-colors cursor-pointer"><div className="flex items-center justify-between"><div><span className="font-medium text-charcoal text-sm">{d.name}</span>{d.mythology && <span className="ml-2 text-xs text-charcoal-lighter">{d.mythology}</span>}</div><StatusBadge status={d.status as PublicationStatus} /></div></Card></Link>))}</div>
      )}
    </div>
  );
}
