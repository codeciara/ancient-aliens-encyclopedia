"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

const claimSchema = z.object({
  statement: z.string().min(1, "Statement is required"),
  evidenceType: z.string().min(1, "Evidence type is required"),
  contextLevel: z.coerce.number().int().min(1).max(5).default(1),
  explanation: z.string().optional().default(""),
  sourceText: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  // Parent entity (one must be provided)
  episodeId: z.string().optional().default(""),
  entryId: z.string().optional().default(""),
  theoryId: z.string().optional().default(""),
});

export async function createClaim(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = claimSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;

  await prisma.claim.create({
    data: {
      statement: data.statement,
      evidenceType: data.evidenceType,
      contextLevel: data.contextLevel,
      explanation: data.explanation || null,
      sourceText: data.sourceText || null,
      notes: data.notes || null,
      episodeId: data.episodeId || null,
      entryId: data.entryId || null,
      theoryId: data.theoryId || null,
    },
  });

  // Revalidate the parent page
  if (data.episodeId) {
    const episode = await prisma.episode.findUnique({ where: { id: data.episodeId }, select: { slug: true } });
    if (episode) revalidatePath(`/episodes/${episode.slug}`);
  }
  if (data.entryId) {
    const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: data.entryId }, select: { slug: true } });
    if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
  }
  if (data.theoryId) {
    const theory = await prisma.theory.findUnique({ where: { id: data.theoryId }, select: { slug: true } });
    if (theory) revalidatePath(`/theories/${theory.slug}`);
  }

  return { success: true };
}

export async function updateClaim(claimId: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = claimSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;

  const claim = await prisma.claim.update({
    where: { id: claimId },
    data: {
      statement: data.statement,
      evidenceType: data.evidenceType,
      contextLevel: data.contextLevel,
      explanation: data.explanation || null,
      sourceText: data.sourceText || null,
      notes: data.notes || null,
    },
  });

  if (claim.episodeId) {
    const episode = await prisma.episode.findUnique({ where: { id: claim.episodeId }, select: { slug: true } });
    if (episode) revalidatePath(`/episodes/${episode.slug}`);
  }
  if (claim.entryId) {
    const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: claim.entryId }, select: { slug: true } });
    if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
  }

  return { success: true };
}

export async function deleteClaim(claimId: string) {
  const claim = await prisma.claim.findUnique({ where: { id: claimId } });
  if (!claim) return;

  await prisma.claim.delete({ where: { id: claimId } });

  if (claim.episodeId) {
    const episode = await prisma.episode.findUnique({ where: { id: claim.episodeId }, select: { slug: true } });
    if (episode) revalidatePath(`/episodes/${episode.slug}`);
  }
  if (claim.entryId) {
    const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: claim.entryId }, select: { slug: true } });
    if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
  }
  if (claim.theoryId) {
    const theory = await prisma.theory.findUnique({ where: { id: claim.theoryId }, select: { slug: true } });
    if (theory) revalidatePath(`/theories/${theory.slug}`);
  }
}

export async function getClaimsForEntity(entityType: string, entityId: string) {
  const where: Record<string, string> = {};
  if (entityType === "episode") where.episodeId = entityId;
  if (entityType === "entry") where.entryId = entityId;
  if (entityType === "theory") where.theoryId = entityId;

  return prisma.claim.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { citations: { include: { source: true } } },
  });
}
