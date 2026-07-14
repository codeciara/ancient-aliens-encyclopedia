"use server";

import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const editionSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  author: z.string().optional().default(""),
  publisher: z.string().optional().default(""),
  isbn: z.string().optional().default(""),
  publicationDate: z.string().optional().default(""),
  language: z.string().optional().default("en"),
  pageSize: z.string().optional().default("US_LETTER"),
  marginPreset: z.string().optional().default("STANDARD"),
  mirroredMargins: z.coerce.boolean().optional().default(true),
  bleedMm: z.coerce.number().optional().default(3.0),
  outputFormat: z.string().optional().default("PDF"),
  status: z.string().optional().default("DRAFT"),
});

export async function getEditions() {
  return prisma.bookEdition.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { chapters: true, frontMatter: true, appendices: true } },
    },
  });
}

export async function getEditionById(id: string) {
  return prisma.bookEdition.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            orderBy: { sortOrder: "asc" },
            include: {
              episode: { select: { id: true, title: true, seasonNumber: true, episodeNumber: true, status: true } },
              entry: { select: { id: true, title: true, status: true } },
              person: { select: { id: true, name: true, status: true } },
              location: { select: { id: true, name: true, status: true } },
              theory: { select: { id: true, title: true, status: true } },
              artifact: { select: { id: true, name: true, status: true } },
              civilization: { select: { id: true, name: true, status: true } },
              deity: { select: { id: true, name: true, status: true } },
              ancientText: { select: { id: true, title: true, status: true } },
            },
          },
        },
      },
      frontMatter: { orderBy: { sortOrder: "asc" } },
      appendices: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createEdition(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = editionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  let slug = generateSlug(data.title);
  const existing = await prisma.bookEdition.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const edition = await prisma.bookEdition.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      slug,
      description: data.description || null,
      author: data.author || null,
      publisher: data.publisher || null,
      isbn: data.isbn || null,
      publicationDate: data.publicationDate || null,
      language: data.language || "en",
      pageSize: data.pageSize || "US_LETTER",
      marginPreset: data.marginPreset || "STANDARD",
      mirroredMargins: data.mirroredMargins ?? true,
      bleedMm: data.bleedMm ?? 3.0,
      outputFormat: data.outputFormat || "PDF",
      status: data.status || "DRAFT",
    },
  });

  // Create default front matter
  const defaultFrontMatter = [
    "COVER", "TITLE_PAGE", "COPYRIGHT", "DISCLAIMER",
    "DEDICATION", "PREFACE", "INTRODUCTION", "HOW_TO_USE",
    "EVIDENCE_EXPLANATION", "TOC",
  ];
  for (let i = 0; i < defaultFrontMatter.length; i++) {
    await prisma.bookFrontMatter.create({
      data: { editionId: edition.id, type: defaultFrontMatter[i], sortOrder: i, isIncluded: true },
    });
  }

  // Create default appendices
  const defaultAppendices = [
    "TIMELINE", "EPISODE_INDEX", "SUBJECT_INDEX", "LOCATION_INDEX",
    "CIVILIZATION_INDEX", "RESEARCHER_INDEX", "ARTIFACT_INDEX",
    "DEITY_INDEX", "ANCIENT_TEXT_INDEX", "BIBLIOGRAPHY",
    "IMAGE_CREDITS", "GLOSSARY",
  ];
  for (let i = 0; i < defaultAppendices.length; i++) {
    await prisma.bookAppendix.create({
      data: { editionId: edition.id, type: defaultAppendices[i], sortOrder: i, isIncluded: true },
    });
  }

  revalidatePath("/book-builder");
  redirect(`/book-builder/${edition.id}`);
}

export async function updateEdition(id: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = editionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;

  await prisma.bookEdition.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      author: data.author || null,
      publisher: data.publisher || null,
      isbn: data.isbn || null,
      publicationDate: data.publicationDate || null,
      language: data.language || "en",
      pageSize: data.pageSize || "US_LETTER",
      marginPreset: data.marginPreset || "STANDARD",
      mirroredMargins: data.mirroredMargins ?? true,
      bleedMm: data.bleedMm ?? 3.0,
      outputFormat: data.outputFormat || "PDF",
      status: data.status || "DRAFT",
    },
  });

  revalidatePath("/book-builder");
  revalidatePath(`/book-builder/${id}`);
  return { success: true };
}

export async function deleteEdition(id: string) {
  await prisma.bookEdition.delete({ where: { id } });
  revalidatePath("/book-builder");
  redirect("/book-builder");
}

// Chapter management
export async function createChapter(editionId: string, title: string, chapterType: string) {
  const maxOrder = await prisma.bookChapter.findFirst({
    where: { editionId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.bookChapter.create({
    data: {
      editionId,
      title,
      chapterType,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/book-builder/${editionId}`);
}

export async function updateChapterOrder(editionId: string, chapterIds: string[]) {
  for (let i = 0; i < chapterIds.length; i++) {
    await prisma.bookChapter.update({
      where: { id: chapterIds[i] },
      data: { sortOrder: i },
    });
  }
  revalidatePath(`/book-builder/${editionId}`);
}

export async function deleteChapter(editionId: string, chapterId: string) {
  await prisma.bookChapter.delete({ where: { id: chapterId } });
  revalidatePath(`/book-builder/${editionId}`);
}

export async function toggleChapterIncluded(editionId: string, chapterId: string, isIncluded: boolean) {
  await prisma.bookChapter.update({ where: { id: chapterId }, data: { isIncluded } });
  revalidatePath(`/book-builder/${editionId}`);
}

// Chapter items
export async function addChapterItem(chapterId: string, entityType: string, entityId: string) {
  const maxOrder = await prisma.bookChapterItem.findFirst({
    where: { chapterId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const data: Record<string, unknown> = {
    chapterId,
    sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
  };
  data[`${entityType}Id`] = entityId;

  await prisma.bookChapterItem.create({ data: data as never });

  const chapter = await prisma.bookChapter.findUnique({ where: { id: chapterId }, select: { editionId: true } });
  if (chapter) revalidatePath(`/book-builder/${chapter.editionId}`);
}

export async function removeChapterItem(itemId: string) {
  const item = await prisma.bookChapterItem.findUnique({ where: { id: itemId }, include: { chapter: { select: { editionId: true } } } });
  await prisma.bookChapterItem.delete({ where: { id: itemId } });
  if (item) revalidatePath(`/book-builder/${item.chapter.editionId}`);
}

export async function updateItemOrder(chapterId: string, itemIds: string[]) {
  for (let i = 0; i < itemIds.length; i++) {
    await prisma.bookChapterItem.update({
      where: { id: itemIds[i] },
      data: { sortOrder: i },
    });
  }
  const chapter = await prisma.bookChapter.findUnique({ where: { id: chapterId }, select: { editionId: true } });
  if (chapter) revalidatePath(`/book-builder/${chapter.editionId}`);
}

// Front matter & appendices
export async function toggleFrontMatter(editionId: string, frontMatterId: string, isIncluded: boolean) {
  await prisma.bookFrontMatter.update({ where: { id: frontMatterId }, data: { isIncluded } });
  revalidatePath(`/book-builder/${editionId}`);
}

export async function toggleAppendix(editionId: string, appendixId: string, isIncluded: boolean) {
  await prisma.bookAppendix.update({ where: { id: appendixId }, data: { isIncluded } });
  revalidatePath(`/book-builder/${editionId}`);
}
