import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

export default async function CivilizationsPage() {
  const civilizations = await prisma.civilization.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Civilizations" description={`${civilizations.length} civilizations`} action={<Link href="/civilizations/new"><Button size="md"><Plus className="h-4 w-4" />Add Civilization</Button></Link>} />
      {civilizations.length === 0 ? (
        <EmptyState icon={Building2} title="No civilizations yet" description="Add ancient civilizations and cultures." action={<Link href="/civilizations/new"><Button>Add First Civilization</Button></Link>} />
      ) : (
        <div className="space-y-2">{civilizations.map((c) => (<Link key={c.id} href={`/civilizations/${c.slug}`}><Card padding="sm" className="hover:border-gold transition-colors cursor-pointer"><div className="flex items-center justify-between"><div><span className="font-medium text-charcoal text-sm">{c.name}</span>{c.timeRange && <span className="ml-2 text-xs text-charcoal-lighter">{c.timeRange}</span>}</div><StatusBadge status={c.status as PublicationStatus} /></div></Card></Link>))}</div>
      )}
    </div>
  );
}
