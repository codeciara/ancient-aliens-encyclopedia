import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";
import { PublicationStatus } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtifactPage({ params }: PageProps) {
  const { slug } = await params;
  const artifact = await prisma.artifact.findUnique({ where: { slug } });

  if (!artifact) notFound();

  async function deleteAction() {
    "use server";
    const { prisma: db } = await import("@/lib/db");
    await db.artifact.delete({ where: { slug } });
    const { redirect } = await import("next/navigation");
    redirect("/artifacts");
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/artifacts" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Artifacts
        </Link>
      </div>

      <PageHeader
        title={artifact.name}
        description={artifact.civilization || undefined}
        action={
          <div className="flex gap-2">
            <form action={deleteAction}>
              <Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {artifact.description && (
            <Card><CardHeader title="Description" /><p className="text-sm whitespace-pre-wrap">{artifact.description}</p></Card>
          )}
          {artifact.archaeologicalConsensus && (
            <Card><CardHeader title="Archaeological Consensus" /><p className="text-sm whitespace-pre-wrap">{artifact.archaeologicalConsensus}</p></Card>
          )}
          {artifact.ancientAstronautView && (
            <Card><CardHeader title="Ancient Astronaut Interpretation" /><p className="text-sm whitespace-pre-wrap">{artifact.ancientAstronautView}</p></Card>
          )}
          {artifact.discoveryContext && (
            <Card><CardHeader title="Discovery Context" /><p className="text-sm whitespace-pre-wrap">{artifact.discoveryContext}</p></Card>
          )}
        </div>

        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-charcoal-lighter">Status</span>
                <StatusBadge status={artifact.status as PublicationStatus} />
              </div>
              {artifact.historicalPeriod && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-charcoal-lighter">Period</span>
                  <span className="text-xs text-charcoal">{artifact.historicalPeriod}</span>
                </div>
              )}
              {artifact.currentLocation && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-charcoal-lighter">Current Location</span>
                  <span className="text-xs text-charcoal">{artifact.currentLocation}</span>
                </div>
              )}
            </div>
          </Card>
          {artifact.internalNotes && (
            <Card padding="sm" className="bg-amber-50 border-amber-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Internal Notes</h4>
              <p className="text-xs text-amber-900 whitespace-pre-wrap">{artifact.internalNotes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
