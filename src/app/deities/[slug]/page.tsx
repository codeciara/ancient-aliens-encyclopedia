import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

interface PageProps { params: Promise<{ slug: string }>; }

export default async function DeityPage({ params }: PageProps) {
  const { slug } = await params;
  const deity = await prisma.deity.findUnique({ where: { slug } });
  if (!deity) notFound();

  async function deleteAction() {
    "use server";
    const { prisma: db } = await import("@/lib/db");
    await db.deity.delete({ where: { slug } });
    const { redirect } = await import("next/navigation");
    redirect("/deities");
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/deities" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Deities
        </Link>
      </div>
      <PageHeader title={deity.name} description={deity.mythology || undefined} action={<form action={deleteAction}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {deity.description && (<Card><CardHeader title="Description" /><p className="text-sm whitespace-pre-wrap">{deity.description}</p></Card>)}
          {deity.ancientAstronautView && (<Card><CardHeader title="Ancient Astronaut Interpretation" /><p className="text-sm whitespace-pre-wrap">{deity.ancientAstronautView}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={deity.status as PublicationStatus} /></div>
              {deity.mythology && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Mythology</span><span className="text-xs text-charcoal">{deity.mythology}</span></div>)}
            </div>
          </Card>
          {deity.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{deity.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
