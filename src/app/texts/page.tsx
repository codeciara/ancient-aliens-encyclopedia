import Link from "next/link";
import { ScrollText, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

export default async function TextsPage() {
  const texts = await prisma.ancientText.findMany({ orderBy: { title: "asc" } });
  return (
    <div>
      <PageHeader title="Ancient Texts" description={`${texts.length} texts`} action={<Link href="/texts/new"><Button size="md"><Plus className="h-4 w-4" />Add Text</Button></Link>} />
      {texts.length === 0 ? (
        <EmptyState icon={ScrollText} title="No ancient texts yet" description="Add sacred texts, inscriptions, and ancient manuscripts." action={<Link href="/texts/new"><Button>Add First Text</Button></Link>} />
      ) : (
        <div className="space-y-2">{texts.map((t) => (<Link key={t.id} href={`/texts/${t.slug}`}><Card padding="sm" className="hover:border-gold transition-colors cursor-pointer"><div className="flex items-center justify-between"><div><span className="font-medium text-charcoal text-sm">{t.title}</span>{t.civilization && <span className="ml-2 text-xs text-charcoal-lighter">{t.civilization}</span>}</div><StatusBadge status={t.status as PublicationStatus} /></div></Card></Link>))}</div>
      )}
    </div>
  );
}
