"use server";

import { prisma } from "@/lib/db";
import { encyclopediaEntrySchema } from "@/lib/validations/encyclopedia";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getEntries(options?: { status?: string; search?: string; category?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.category) where.category = options.category;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { briefOverview: { contains: options.search } },
      { alternateNames: { contains: options.search } },
    ];
  }

  return prisma.encyclopediaEntry.findMany({
    where,
    orderBy: { title: "asc" },
    include: {
      _count: { select: { claims: true, citations: true, episodeEntries: true } },
    },
  });
}

export async function getEntryBySlug(slug: string) {
  return prisma.encyclopediaEntry.findUnique({
    where: { slug },
    include: {
      claims: true,
      citations: { include: { source: true } },
      tags: { include: { tag: true } },
      entryPeople: { include: { person: true } },
      entryLocations: { include: { location: true } },
      entryArtifacts: { include: { artifact: true } },
      episodeEntries: { include: { episode: true } },
      relatedFrom: { include: { target: true } },
      relatedTo: { include: { source: true } },
    },
  });
}

export async function createEntry(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = encyclopediaEntrySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = generateSlug(data.title);
  const existing = await prisma.encyclopediaEntry.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.encyclopediaEntry.create({
    data: {
      ...data,
      slug,
      alternateNames: data.alternateNames || null,
      category: data.category || null,
      briefOverview: data.briefOverview || null,
      historicalBackground: data.historicalBackground || null,
      ancientAstronautView: data.ancientAstronautView || null,
      mainstreamView: data.mainstreamView || null,
      evidenceCited: data.evidenceCited || null,
      unresolvedQuestions: data.unresolvedQuestions || null,
      internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/encyclopedia");
  redirect("/encyclopedia");
}

export async function updateEntry(slug: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = encyclopediaEntrySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { slug } });
  if (!entry) return { error: { _form: ["Entry not found"] } };

  let newSlug = slug;
  const expectedSlug = generateSlug(data.title);
  if (expectedSlug !== slug) {
    const collision = await prisma.encyclopediaEntry.findUnique({ where: { slug: expectedSlug } });
    if (!collision || collision.id === entry.id) newSlug = expectedSlug;
  }

  await prisma.encyclopediaEntry.update({
    where: { slug },
    data: {
      ...data,
      slug: newSlug,
      alternateNames: data.alternateNames || null,
      category: data.category || null,
      briefOverview: data.briefOverview || null,
      historicalBackground: data.historicalBackground || null,
      ancientAstronautView: data.ancientAstronautView || null,
      mainstreamView: data.mainstreamView || null,
      evidenceCited: data.evidenceCited || null,
      unresolvedQuestions: data.unresolvedQuestions || null,
      internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/encyclopedia");
  revalidatePath(`/encyclopedia/${newSlug}`);
  redirect(`/encyclopedia/${newSlug}`);
}

export async function deleteEntry(slug: string) {
  await prisma.encyclopediaEntry.delete({ where: { slug } });
  revalidatePath("/encyclopedia");
  redirect("/encyclopedia");
}
