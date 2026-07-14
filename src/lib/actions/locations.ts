"use server";

import { prisma } from "@/lib/db";
import { locationSchema } from "@/lib/validations/location";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLocations(options?: { status?: string; search?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { country: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }
  return prisma.location.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { episodeLocations: true, entryLocations: true } } },
  });
}

export async function getLocationBySlug(slug: string) {
  return prisma.location.findUnique({
    where: { slug },
    include: {
      episodeLocations: { include: { episode: true } },
      entryLocations: { include: { entry: true } },
      locationArtifacts: { include: { artifact: true } },
      citations: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createLocation(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = locationSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  let slug = generateSlug(data.name);
  const existing = await prisma.location.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.location.create({
    data: {
      ...data, slug,
      latitude: data.latitude ?? null, longitude: data.longitude ?? null,
      country: data.country || null, region: data.region || null,
      civilization: data.civilization || null, historicalPeriod: data.historicalPeriod || null,
      knownBuilders: data.knownBuilders || null, description: data.description || null,
      archaeologicalConsensus: data.archaeologicalConsensus || null,
      ancientAstronautView: data.ancientAstronautView || null,
      unresolvedQuestions: data.unresolvedQuestions || null,
      mapReference: data.mapReference || null, internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/locations");
  redirect("/locations");
}

export async function updateLocation(slug: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = locationSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const location = await prisma.location.findUnique({ where: { slug } });
  if (!location) return { error: { _form: ["Location not found"] } };

  let newSlug = slug;
  const expectedSlug = generateSlug(data.name);
  if (expectedSlug !== slug) {
    const collision = await prisma.location.findUnique({ where: { slug: expectedSlug } });
    if (!collision || collision.id === location.id) newSlug = expectedSlug;
  }

  await prisma.location.update({
    where: { slug },
    data: {
      ...data, slug: newSlug,
      latitude: data.latitude ?? null, longitude: data.longitude ?? null,
      country: data.country || null, region: data.region || null,
      civilization: data.civilization || null, historicalPeriod: data.historicalPeriod || null,
      knownBuilders: data.knownBuilders || null, description: data.description || null,
      archaeologicalConsensus: data.archaeologicalConsensus || null,
      ancientAstronautView: data.ancientAstronautView || null,
      unresolvedQuestions: data.unresolvedQuestions || null,
      mapReference: data.mapReference || null, internalNotes: data.internalNotes || null,
    },
  });

  revalidatePath("/locations");
  redirect(`/locations/${newSlug}`);
}

export async function deleteLocation(slug: string) {
  await prisma.location.delete({ where: { slug } });
  revalidatePath("/locations");
  redirect("/locations");
}
