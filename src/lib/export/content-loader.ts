// Loads edition content from the database into the BookContent structure
// used by both PDF and EPUB export engines

import { prisma } from "@/lib/db";
import { BookContent, ChapterItemContent } from "./types";

export async function loadBookContent(editionId: string): Promise<BookContent | null> {
  const edition = await prisma.bookEdition.findUnique({
    where: { id: editionId },
    include: {
      frontMatter: { orderBy: { sortOrder: "asc" } },
      appendices: { orderBy: { sortOrder: "asc" } },
      chapters: {
        where: { isIncluded: true },
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            where: { isIncluded: true },
            orderBy: { sortOrder: "asc" },
            include: {
              episode: { include: { claims: true, citations: { include: { source: true } } } },
              entry: { include: { claims: true, citations: { include: { source: true } } } },
              person: { include: { citations: { include: { source: true } } } },
              location: { include: { citations: { include: { source: true } } } },
              theory: { include: { claims: true, citations: { include: { source: true } } } },
              artifact: true,
              civilization: true,
              deity: true,
              ancientText: true,
            },
          },
        },
      },
    },
  });

  if (!edition) return null;

  // Transform to BookContent structure
  const chapters = edition.chapters.map((chapter) => ({
    title: chapter.title,
    subtitle: chapter.subtitle,
    chapterType: chapter.chapterType,
    items: chapter.items.map((item): ChapterItemContent => {
      if (item.episode) return { type: "episode" as const, data: item.episode as unknown as Record<string, unknown> };
      if (item.entry) return { type: "entry" as const, data: item.entry as unknown as Record<string, unknown> };
      if (item.person) return { type: "person" as const, data: item.person as unknown as Record<string, unknown> };
      if (item.location) return { type: "location" as const, data: item.location as unknown as Record<string, unknown> };
      if (item.theory) return { type: "theory" as const, data: item.theory as unknown as Record<string, unknown> };
      if (item.artifact) return { type: "artifact" as const, data: item.artifact as unknown as Record<string, unknown> };
      if (item.civilization) return { type: "civilization" as const, data: item.civilization as unknown as Record<string, unknown> };
      if (item.deity) return { type: "deity" as const, data: item.deity as unknown as Record<string, unknown> };
      if (item.ancientText) return { type: "ancientText" as const, data: item.ancientText as unknown as Record<string, unknown> };
      return { type: "entry" as const, data: {} };
    }).filter(item => Object.keys(item.data).length > 0),
  }));

  return {
    edition: {
      title: edition.title,
      subtitle: edition.subtitle,
      author: edition.author,
      publisher: edition.publisher,
      isbn: edition.isbn,
      publicationDate: edition.publicationDate,
      language: edition.language,
      pageSize: edition.pageSize,
      marginPreset: edition.marginPreset,
      mirroredMargins: edition.mirroredMargins,
      bleedMm: edition.bleedMm,
    },
    frontMatter: edition.frontMatter.map((fm) => ({
      type: fm.type,
      content: fm.content,
      isIncluded: fm.isIncluded,
    })),
    chapters,
    appendices: edition.appendices.map((app) => ({
      type: app.type,
      isIncluded: app.isIncluded,
    })),
  };
}
