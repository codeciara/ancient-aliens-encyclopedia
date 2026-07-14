"use server";

import { prisma } from "@/lib/db";
import { episodeSchema } from "@/lib/validations/episode";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getEpisodes(options?: {
  status?: string;
  season?: number;
  search?: string;
}) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.season) where.seasonNumber = options.season;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { summary: { contains: options.search } },
    ];
  }

  return prisma.episode.findMany({
    where,
    orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }],
    include: {
      _count: { select: { claims: true, citations: true } },
    },
  });
}

export async function getEpisodeBySlug(slug: string) {
  return prisma.episode.findUnique({
    where: { slug },
    include: {
      claims: true,
      citations: { include: { source: true } },
      tags: { include: { tag: true } },
      episodePeople: { include: { person: true } },
      episodeLocations: { include: { location: true } },
      episodeArtifacts: { include: { artifact: true } },
      episodeCivilizations: { include: { civilization: true } },
      episodeEntries: { include: { entry: true } },
    },
  });
}

export async function createEpisode(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = episodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = generateSlug(`s${data.seasonNumber}e${data.episodeNumber}-${data.title}`);

  // Check for slug collision
  const existing = await prisma.episode.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  await prisma.episode.create({
    data: {
      ...data,
      slug,
      originalAirDate: data.originalAirDate || null,
      summary: data.summary || null,
      centralQuestion: data.centralQuestion || null,
      mainSubjects: data.mainSubjects || null,
      conventionalExplanations: data.conventionalExplanations || null,
      internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/episodes");
  redirect("/episodes");
}

export async function updateEpisode(slug: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = episodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const episode = await prisma.episode.findUnique({ where: { slug } });
  if (!episode) {
    return { error: { _form: ["Episode not found"] } };
  }

  // Generate new slug if title changed
  let newSlug = slug;
  const expectedSlug = generateSlug(`s${data.seasonNumber}e${data.episodeNumber}-${data.title}`);
  if (expectedSlug !== slug) {
    const collision = await prisma.episode.findUnique({ where: { slug: expectedSlug } });
    if (!collision || collision.id === episode.id) {
      newSlug = expectedSlug;
    }
  }

  await prisma.episode.update({
    where: { slug },
    data: {
      ...data,
      slug: newSlug,
      originalAirDate: data.originalAirDate || null,
      summary: data.summary || null,
      centralQuestion: data.centralQuestion || null,
      mainSubjects: data.mainSubjects || null,
      conventionalExplanations: data.conventionalExplanations || null,
      internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/episodes");
  revalidatePath(`/episodes/${newSlug}`);
  redirect(`/episodes/${newSlug}`);
}

export async function deleteEpisode(slug: string) {
  await prisma.episode.delete({ where: { slug } });
  revalidatePath("/episodes");
  redirect("/episodes");
}
