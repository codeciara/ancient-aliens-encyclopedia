import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEditionById } from "@/lib/actions/book-editions";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

const FRONT_MATTER_LABELS: Record<string, string> = {
  COVER: "Cover",
  TITLE_PAGE: "Title Page",
  COPYRIGHT: "Copyright Page",
  DISCLAIMER: "Independent Publication Disclaimer",
  DEDICATION: "Dedication",
  PREFACE: "Preface",
  INTRODUCTION: "Introduction",
  HOW_TO_USE: "How to Use This Book",
  EVIDENCE_EXPLANATION: "Evidence Label Explanation",
  TOC: "Table of Contents",
};

const APPENDIX_LABELS: Record<string, string> = {
  TIMELINE: "Chronological Timeline",
  EPISODE_INDEX: "Episode Index",
  SUBJECT_INDEX: "Subject Index",
  LOCATION_INDEX: "Location Index",
  CIVILIZATION_INDEX: "Civilization Index",
  RESEARCHER_INDEX: "Researcher Index",
  ARTIFACT_INDEX: "Artifact Index",
  DEITY_INDEX: "Deity Index",
  ANCIENT_TEXT_INDEX: "Ancient Text Index",
  BIBLIOGRAPHY: "Bibliography",
  IMAGE_CREDITS: "Image Credits",
  GLOSSARY: "Glossary",
};

function getItemTitle(item: Record<string, unknown>): string {
  const ep = item.episode as { title: string; seasonNumber: number; episodeNumber: number } | null;
  if (ep) return `S${ep.seasonNumber}E${ep.episodeNumber}: ${ep.title}`;
  const entry = item.entry as { title: string } | null;
  if (entry) return entry.title;
  const person = item.person as { name: string } | null;
  if (person) return person.name;
  const location = item.location as { name: string } | null;
  if (location) return location.name;
  const theory = item.theory as { title: string } | null;
  if (theory) return theory.title;
  const artifact = item.artifact as { name: string } | null;
  if (artifact) return artifact.name;
  const civ = item.civilization as { name: string } | null;
  if (civ) return civ.name;
  const deity = item.deity as { name: string } | null;
  if (deity) return deity.name;
  const text = item.ancientText as { title: string } | null;
  if (text) return text.title;
  return "Untitled";
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const edition = await getEditionById(id);
  if (!edition) notFound();

  const includedFrontMatter = edition.frontMatter.filter(f => f.isIncluded);
  const includedChapters = edition.chapters.filter(c => c.isIncluded);
  const includedAppendices = edition.appendices.filter(a => a.isIncluded);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/book-builder/${id}`} className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Editor
        </Link>
        <Button variant="secondary" size="sm" onClick={() => {}}>
          Print Preview
        </Button>
      </div>

      {/* Book Preview Container */}
      <div className="max-w-4xl mx-auto">
        {/* Simulated Book Pages */}
        <div className="space-y-8">

          {/* === FRONT MATTER === */}
          {includedFrontMatter.map((fm) => (
            <div
              key={fm.id}
              className="bg-white border border-parchment-darker rounded-lg shadow-sm overflow-hidden"
            >
              {fm.type === "COVER" ? (
                /* Cover Page */
                <div className="aspect-[8.5/11] flex flex-col items-center justify-center bg-gradient-to-b from-deep-blue to-night-sky text-center p-12">
                  <p className="text-gold-light text-xs uppercase tracking-[0.3em] mb-8">An Independent Reference</p>
                  <h1 className="font-display text-4xl text-parchment leading-tight mb-4">
                    {edition.title}
                  </h1>
                  {edition.subtitle && (
                    <p className="text-parchment/70 text-sm max-w-md leading-relaxed mb-8">
                      {edition.subtitle}
                    </p>
                  )}
                  {edition.author && (
                    <p className="text-gold-muted text-sm mt-auto">{edition.author}</p>
                  )}
                </div>
              ) : fm.type === "TITLE_PAGE" ? (
                <div className="aspect-[8.5/11] flex flex-col items-center justify-center p-12 text-center">
                  <h1 className="font-display text-3xl text-charcoal mb-3">{edition.title}</h1>
                  {edition.subtitle && <p className="text-charcoal-lighter text-sm mb-8">{edition.subtitle}</p>}
                  {edition.author && <p className="text-charcoal text-base">{edition.author}</p>}
                  {edition.publisher && <p className="text-charcoal-lighter text-sm mt-2">{edition.publisher}</p>}
                </div>
              ) : fm.type === "DISCLAIMER" ? (
                <div className="aspect-[8.5/11] flex flex-col justify-center p-12">
                  <h2 className="font-heading text-lg text-charcoal mb-4">Independent Publication Notice</h2>
                  <div className="text-sm text-charcoal-lighter leading-relaxed space-y-3 max-w-lg">
                    <p>
                      This is an independent reference work. It is not endorsed by, affiliated with,
                      authorized by, or connected in any way to the History Channel, A+E Networks,
                      Prometheus Entertainment, or any producers, participants, or distributors of
                      the Ancient Aliens television program.
                    </p>
                    <p>
                      All original commentary, summaries, and analysis in this work represent the
                      views of the author(s). Episode descriptions are original summaries written
                      for reference purposes.
                    </p>
                    <p>
                      Trademarks and program titles are the property of their respective owners and
                      are used solely for identification and reference purposes.
                    </p>
                  </div>
                </div>
              ) : fm.type === "TOC" ? (
                <div className="aspect-[8.5/11] p-12">
                  <h2 className="font-display text-2xl text-charcoal mb-6 border-b border-gold pb-2">
                    Table of Contents
                  </h2>
                  <div className="space-y-3">
                    {includedChapters.map((ch, i) => (
                      <div key={ch.id} className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-charcoal">{i + 1}.</span>
                        <span className="text-sm text-charcoal flex-1">{ch.title}</span>
                        <span className="text-xs text-charcoal-lighter border-b border-dotted border-charcoal-lighter flex-1 mx-2" />
                        <span className="text-xs text-charcoal-lighter">{ch.items.length} entries</span>
                      </div>
                    ))}
                    {includedAppendices.length > 0 && (
                      <>
                        <div className="pt-2 mt-2 border-t border-parchment-darker">
                          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-lighter mb-2">Appendices</p>
                        </div>
                        {includedAppendices.map((app) => (
                          <div key={app.id} className="flex items-baseline gap-2 pl-4">
                            <span className="text-xs text-charcoal">{APPENDIX_LABELS[app.type] || app.type}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-[8.5/11] flex flex-col justify-center items-center p-12 text-center">
                  <p className="text-charcoal-lighter text-sm">{FRONT_MATTER_LABELS[fm.type] || fm.type}</p>
                  <p className="text-xs text-charcoal-lighter mt-2 italic">(Content to be added)</p>
                </div>
              )}
            </div>
          ))}

          {/* === CHAPTERS === */}
          {includedChapters.map((chapter, chapterIndex) => (
            <div key={chapter.id}>
              {/* Chapter Title Page */}
              <div className="bg-white border border-parchment-darker rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[8.5/11] flex flex-col justify-center items-center p-12 text-center bg-gradient-to-b from-parchment to-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
                    Chapter {chapterIndex + 1}
                  </p>
                  <h2 className="font-display text-3xl text-charcoal">{chapter.title}</h2>
                  {chapter.subtitle && (
                    <p className="text-charcoal-lighter mt-2">{chapter.subtitle}</p>
                  )}
                  <div className="mt-6 w-16 h-px bg-gold" />
                </div>
              </div>

              {/* Chapter Content */}
              {chapter.items.length > 0 && (
                <div className="bg-white border border-parchment-darker rounded-lg shadow-sm overflow-hidden mt-4">
                  <div className="p-8 min-h-[400px]">
                    <div className="space-y-4">
                      {chapter.items.map((item) => (
                        <div key={item.id} className="border-b border-parchment-darker pb-3 last:border-0">
                          <h3 className="font-heading text-base text-charcoal">
                            {getItemTitle(item as unknown as Record<string, unknown>)}
                          </h3>
                          <p className="text-xs text-charcoal-lighter mt-1 italic">
                            (Full content will be rendered in export)
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* === APPENDICES === */}
          {includedAppendices.length > 0 && (
            <div className="bg-white border border-parchment-darker rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="font-display text-2xl text-charcoal mb-4 border-b border-gold pb-2">
                  Appendices
                </h2>
                <div className="space-y-3">
                  {includedAppendices.map((app) => (
                    <div key={app.id} className="py-2 border-b border-parchment-darker last:border-0">
                      <p className="text-sm font-medium text-charcoal">{APPENDIX_LABELS[app.type] || app.type}</p>
                      <p className="text-xs text-charcoal-lighter italic">(Auto-generated on export)</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
