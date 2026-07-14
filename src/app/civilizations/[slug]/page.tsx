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

export default async function CivilizationPage({ params }: PageProps) {
  const { slug } = await params;
  const civ = await prisma.civilization.findUnique({ where: { slug } });
  if (!civ) notFound();

  async function deleteAction() {
    "use server";
    const { prisma: db } = await import("@/lib/db");
    await db.civilization.delete({ where: { slug } });
    const { redirect } = await import("next/navigation");
    redirect("/civilizations");
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/civilizations" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Civilizations
        </Link>
      </div>
      <PageHeader title={civ.name} description={civ.timeRange || undefined} action={<form action={deleteAction}><Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button></form>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {civ.description && (<Card><CardHeader title="Description" /><p className="text-sm whitespace-pre-wrap">{civ.description}</p></Card>)}
          {civ.notableAchievements && (<Card><CardHeader title="Notable Achievements" /><p className="text-sm whitespace-pre-wrap">{civ.notableAchievements}</p></Card>)}
        </div>
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Status</span><StatusBadge status={civ.status as PublicationStatus} /></div>
              {civ.region && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Region</span><span className="text-xs text-charcoal">{civ.region}</span></div>)}
              {civ.timeRange && (<div className="flex justify-between items-center"><span className="text-xs text-charcoal-lighter">Time Range</span><span className="text-xs text-charcoal">{civ.timeRange}</span></div>)}
            </div>
          </Card>
          {civ.internalNotes && (<Card padding="sm" className="bg-amber-50 border-amber-200"><h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4><p className="text-xs text-amber-900 whitespace-pre-wrap">{civ.internalNotes}</p></Card>)}
        </div>
      </div>
    </div>
  );
}
