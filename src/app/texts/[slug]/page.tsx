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

export default async function AncientTextPage({ params }: PageProps) {
  const { slug } = await params;
  const text = await prisma.ancientText.findUnique({ where: { slug } });
  if (!text) notFound();

  async function deleteAction() {
    "use server";
    const { prisma: db } = await import("@/lib/db");
    await db.ancientText.delete({ where: { slug } });
    const { redirect } = await import("next/navigation");
    redirect("/texts");
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/texts" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Ancient Texts
        </Link>
      </div>
      <PageHeader title={text.title} description={text.civilization || undefined} action={<form action={deleteAction}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {text.description && (<Card><CardHeader title="Description" /><p className="text-sm whitespace-pre-wrap">{text.description}</p></Card>)}
          {text.relevantPassages && (<Card><CardHeader title="Relevant Passages" /><p className="text-sm whitespace-pre-wrap">{text.relevantPassages}</p></Card>)}
          {text.ancientAstronautView && (<Card><CardHeader title="Ancient Astronaut Interpretation" /><p className="text-sm whitespace-pre-wrap">{text.ancientAstronautView}</p></Card>)}
          {text.scholarlyConsensus && (<Card><CardHeader title="Scholarly Consensus" /><p className="text-sm whitespace-pre-wrap">{text.scholarlyConsensus}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={text.status as PublicationStatus} /></div>
              {text.approximateDate && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Date</span><span className="text-xs text-charcoal">{text.approximateDate}</span></div>)}
              {text.origin && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Origin</span><span className="text-xs text-charcoal">{text.origin}</span></div>)}
            </div>
          </Card>
          {text.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{text.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
