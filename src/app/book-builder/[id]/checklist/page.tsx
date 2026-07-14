import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEditionById } from "@/lib/actions/book-editions";
import { prisma } from "@/lib/db";

interface CheckItem {
  id: string;
  label: string;
  description: string;
  status: "pass" | "fail" | "warn";
  details?: string;
}

async function runChecklist(editionId: string): Promise<CheckItem[]> {
  const edition = await getEditionById(editionId);
  if (!edition) return [];

  const checks: CheckItem[] = [];

  // 1. Required front matter exists
  const requiredFM = ["TITLE_PAGE", "COPYRIGHT", "DISCLAIMER", "TOC"];
  const includedFM = edition.frontMatter.filter(f => f.isIncluded).map(f => f.type);
  const missingFM = requiredFM.filter(fm => !includedFM.includes(fm));
  checks.push({
    id: "front-matter",
    label: "Required front matter",
    description: "Title page, copyright, disclaimer, and TOC must be included",
    status: missingFM.length === 0 ? "pass" : "fail",
    details: missingFM.length > 0 ? `Missing: ${missingFM.join(", ")}` : undefined,
  });

  // 2. All selected chapters have content
  const emptyChapters = edition.chapters.filter(ch => ch.isIncluded && ch.items.length === 0 && !ch.isDivider);
  checks.push({
    id: "chapters-content",
    label: "All chapters have content",
    description: "Included chapters should contain at least one item",
    status: emptyChapters.length === 0 ? "pass" : "warn",
    details: emptyChapters.length > 0 ? `Empty chapters: ${emptyChapters.map(c => c.title).join(", ")}` : undefined,
  });

  // 3. Content items are approved
  const allItems = edition.chapters.flatMap(ch => ch.items);
  const unapproved = allItems.filter(item => {
    const status = item.episode?.status || item.entry?.status || item.person?.status || item.location?.status || item.theory?.status || item.artifact?.status || item.civilization?.status || item.deity?.status || item.ancientText?.status || "DRAFT";
    return status !== "APPROVED" && status !== "PUBLISHED";
  });
  checks.push({
    id: "content-approved",
    label: "All content items approved",
    description: "Included items should have APPROVED or PUBLISHED status",
    status: unapproved.length === 0 ? "pass" : allItems.length === 0 ? "warn" : unapproved.length > allItems.length / 2 ? "fail" : "warn",
    details: unapproved.length > 0 ? `${unapproved.length} of ${allItems.length} items not yet approved` : undefined,
  });

  // 4. Citations present
  const totalCitations = await prisma.citation.count();
  checks.push({
    id: "citations",
    label: "Citations present",
    description: "Content should have supporting citations",
    status: totalCitations > 0 ? "pass" : "warn",
    details: `${totalCitations} total citations in database`,
  });

  // 5. Images have credits
  const imagesWithoutCredit = await prisma.imageAsset.count({ where: { credit: null } });
  const totalImages = await prisma.imageAsset.count();
  checks.push({
    id: "image-credits",
    label: "Images have credits",
    description: "All images should have credit and license information",
    status: totalImages === 0 ? "pass" : imagesWithoutCredit === 0 ? "pass" : "warn",
    details: totalImages === 0 ? "No images uploaded yet" : `${imagesWithoutCredit} of ${totalImages} images missing credits`,
  });

  // 6. No placeholder content
  const placeholderEpisodes = await prisma.episode.count({ where: { title: { contains: "[TEMPLATE]" } } });
  const placeholderEntries = await prisma.encyclopediaEntry.count({ where: { title: { contains: "[TEMPLATE]" } } });
  const totalPlaceholders = placeholderEpisodes + placeholderEntries;
  checks.push({
    id: "no-placeholders",
    label: "No placeholder content",
    description: "Content marked as [TEMPLATE] should be replaced with real content",
    status: totalPlaceholders === 0 ? "pass" : "fail",
    details: totalPlaceholders > 0 ? `${totalPlaceholders} items still marked as [TEMPLATE]` : undefined,
  });

  // 7. Export metadata complete
  const metaComplete = edition.title && edition.author;
  checks.push({
    id: "metadata",
    label: "Export metadata complete",
    description: "Title and author are required for export",
    status: metaComplete ? "pass" : "fail",
    details: !metaComplete ? "Missing: " + (!edition.title ? "title " : "") + (!edition.author ? "author" : "") : undefined,
  });

  // 8. At least one chapter
  checks.push({
    id: "has-chapters",
    label: "At least one chapter exists",
    description: "The edition needs at least one chapter with content",
    status: edition.chapters.filter(c => c.isIncluded).length > 0 ? "pass" : "fail",
  });

  // 9. Table of contents can be generated
  checks.push({
    id: "toc-generated",
    label: "Table of contents can be generated",
    description: "TOC is enabled in front matter and chapters exist",
    status: includedFM.includes("TOC") && edition.chapters.length > 0 ? "pass" : "warn",
  });

  // 10. Edition status
  checks.push({
    id: "edition-status",
    label: "Edition marked as ready",
    description: "Edition should be APPROVED or PUBLISHED for final export",
    status: edition.status === "APPROVED" || edition.status === "PUBLISHED" ? "pass" : "warn",
    details: `Current status: ${edition.status}`,
  });

  return checks;
}

interface ChecklistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { id } = await params;
  const edition = await getEditionById(id);
  if (!edition) notFound();

  const checks = await runChecklist(id);
  const passCount = checks.filter(c => c.status === "pass").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  const warnCount = checks.filter(c => c.status === "warn").length;

  return (
    <div>
      <div className="mb-4">
        <Link href={`/book-builder/${id}`} className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to {edition.title}
        </Link>
      </div>

      <PageHeader
        title="Publication Checklist"
        description={`${passCount} passed, ${warnCount} warnings, ${failCount} failed`}
        action={
          failCount === 0 ? (
            <Link href={`/book-builder/${id}/export`}>
              <Button variant="gold">Ready to Export</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>Fix issues before export</Button>
          )
        }
      />

      {/* Summary Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">{passCount} passed</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-amber-700 font-medium">{warnCount} warnings</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-700 font-medium">{failCount} failed</span>
        </div>
      </div>

      {/* Checks */}
      <div className="space-y-3">
        {checks.map((check) => (
          <Card key={check.id} padding="sm" className={
            check.status === "pass" ? "border-green-200 bg-green-50/50" :
            check.status === "warn" ? "border-amber-200 bg-amber-50/50" :
            "border-red-200 bg-red-50/50"
          }>
            <div className="flex items-start gap-3">
              {check.status === "pass" && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
              {check.status === "warn" && <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />}
              {check.status === "fail" && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">{check.label}</p>
                <p className="text-xs text-charcoal-lighter">{check.description}</p>
                {check.details && (
                  <p className="text-xs mt-1 text-charcoal-lighter italic">{check.details}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
