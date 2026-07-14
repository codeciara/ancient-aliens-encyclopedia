"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

const citationSchema = z.object({
  sourceId: z.string().min(1, "Source is required"),
  pageNumbers: z.string().optional().default(""),
  chapter: z.string().optional().default(""),
  quote: z.string().optional().default(""),
  note: z.string().optional().default(""),
  accessDate: z.string().optional().default(""),
  // Parent entity (one must be provided)
  episodeId: z.string().optional().default(""),
  entryId: z.string().optional().default(""),
  personId: z.string().optional().default(""),
  locationId: z.string().optional().default(""),
  artifactId: z.string().optional().default(""),
  civilizationId: z.string().optional().default(""),
  deityId: z.string().optional().default(""),
  ancientTextId: z.string().optional().default(""),
  claimId: z.string().optional().default(""),
  theoryId: z.string().optional().default(""),
});

export async function createCitation(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = citationSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;

  await prisma.citation.create({
    data: {
      sourceId: data.sourceId,
      pageNumbers: data.pageNumbers || null,
      chapter: data.chapter || null,
      quote: data.quote || null,
      note: data.note || null,
      accessDate: data.accessDate || null,
      episodeId: data.episodeId || null,
      entryId: data.entryId || null,
      personId: data.personId || null,
      locationId: data.locationId || null,
      artifactId: data.artifactId || null,
      civilizationId: data.civilizationId || null,
      deityId: data.deityId || null,
      ancientTextId: data.ancientTextId || null,
      claimId: data.claimId || null,
      theoryId: data.theoryId || null,
    },
  });

  return { success: true };
}

export async function deleteCitation(citationId: string) {
  await prisma.citation.delete({ where: { id: citationId } });
}

export async function getAllSources() {
  return prisma.source.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, author: true },
  });
}
