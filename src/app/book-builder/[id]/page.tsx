import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, CheckSquare, Settings, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getEditionById, deleteEdition } from "@/lib/actions/book-editions";
import { PublicationStatus } from "@/types";
import { ChapterManager } from "@/components/book-builder/chapter-manager";
import { FrontMatterConfig } from "@/components/book-builder/front-matter-config";
import { AppendixConfig } from "@/components/book-builder/appendix-config";
import { EditionSettings } from "@/components/book-builder/edition-settings";

interface EditionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditionPage({ params }: EditionPageProps) {
  const { id } = await params;
  const edition = await getEditionById(id);

  if (!edition) notFound();

  const totalItems = edition.chapters.reduce((sum, ch) => sum + ch.items.length, 0);

  return (
    <div>
      <div className="mb-4">
        <Link href="/book-builder" className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Editions
        </Link>
      </div>

      <PageHeader
        title={edition.title}
        description={edition.subtitle || undefined}
        action={
          <div className="flex gap-2">
            <Link href={`/book-builder/${id}/preview`}>
              <Button variant="gold" size="sm"><Eye className="h-3.5 w-3.5" />Preview</Button>
            </Link>
            <Link href={`/book-builder/${id}/checklist`}>
              <Button variant="secondary" size="sm"><CheckSquare className="h-3.5 w-3.5" />Checklist</Button>
            </Link>
            <form action={async () => { "use server"; await deleteEdition(id); }}>
              <Button variant="danger" size="sm" type="submit"><Trash2 className="h-3.5 w-3.5" /></Button>
            </form>
          </div>
        }
      />

      {/* Edition Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Card padding="sm" className="text-center">
          <p className="text-xl font-display text-charcoal">{edition.chapters.length}</p>
          <p className="text-xs text-charcoal-lighter">Chapters</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xl font-display text-charcoal">{totalItems}</p>
          <p className="text-xs text-charcoal-lighter">Content Items</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xl font-display text-charcoal">{edition.frontMatter.filter(f => f.isIncluded).length}</p>
          <p className="text-xs text-charcoal-lighter">Front Matter</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xl font-display text-charcoal">{edition.appendices.filter(a => a.isIncluded).length}</p>
          <p className="text-xs text-charcoal-lighter">Appendices</p>
        </Card>
        <Card padding="sm" className="text-center">
          <StatusBadge status={edition.status as PublicationStatus} />
          <p className="text-xs text-charcoal-lighter mt-1">{edition.outputFormat}</p>
        </Card>
      </div>

      {/* Main Layout: Chapters + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapters (main area) */}
        <div className="lg:col-span-2">
          <ChapterManager editionId={edition.id} chapters={edition.chapters} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <FrontMatterConfig editionId={edition.id} items={edition.frontMatter} />
          <AppendixConfig editionId={edition.id} items={edition.appendices} />
          <EditionSettings edition={edition} />
        </div>
      </div>
    </div>
  );
}
