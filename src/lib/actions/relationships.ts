"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Link an episode to an encyclopedia entry
export async function linkEpisodeEntry(episodeId: string, entryId: string) {
  await prisma.episodeEntry.create({ data: { episodeId, entryId } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

export async function unlinkEpisodeEntry(episodeId: string, entryId: string) {
  await prisma.episodeEntry.delete({ where: { episodeId_entryId: { episodeId, entryId } } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

// Link an episode to a person
export async function linkEpisodePerson(episodeId: string, personId: string, role?: string) {
  await prisma.episodePerson.create({ data: { episodeId, personId, role: role || null } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

export async function unlinkEpisodePerson(episodeId: string, personId: string) {
  await prisma.episodePerson.delete({ where: { episodeId_personId: { episodeId, personId } } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

// Link an episode to a location
export async function linkEpisodeLocation(episodeId: string, locationId: string) {
  await prisma.episodeLocation.create({ data: { episodeId, locationId } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

export async function unlinkEpisodeLocation(episodeId: string, locationId: string) {
  await prisma.episodeLocation.delete({ where: { episodeId_locationId: { episodeId, locationId } } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

// Link an episode to an artifact
export async function linkEpisodeArtifact(episodeId: string, artifactId: string) {
  await prisma.episodeArtifact.create({ data: { episodeId, artifactId } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

export async function unlinkEpisodeArtifact(episodeId: string, artifactId: string) {
  await prisma.episodeArtifact.delete({ where: { episodeId_artifactId: { episodeId, artifactId } } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

// Link an episode to a civilization
export async function linkEpisodeCivilization(episodeId: string, civilizationId: string) {
  await prisma.episodeCivilization.create({ data: { episodeId, civilizationId } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

export async function unlinkEpisodeCivilization(episodeId: string, civilizationId: string) {
  await prisma.episodeCivilization.delete({ where: { episodeId_civilizationId: { episodeId, civilizationId } } }).catch(() => {});
  const episode = await prisma.episode.findUnique({ where: { id: episodeId }, select: { slug: true } });
  if (episode) revalidatePath(`/episodes/${episode.slug}`);
}

// Link an entry to a person
export async function linkEntryPerson(entryId: string, personId: string) {
  await prisma.entryPerson.create({ data: { entryId, personId } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

export async function unlinkEntryPerson(entryId: string, personId: string) {
  await prisma.entryPerson.delete({ where: { entryId_personId: { entryId, personId } } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

// Link an entry to a location
export async function linkEntryLocation(entryId: string, locationId: string) {
  await prisma.entryLocation.create({ data: { entryId, locationId } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

export async function unlinkEntryLocation(entryId: string, locationId: string) {
  await prisma.entryLocation.delete({ where: { entryId_locationId: { entryId, locationId } } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

// Link an entry to an artifact
export async function linkEntryArtifact(entryId: string, artifactId: string) {
  await prisma.entryArtifact.create({ data: { entryId, artifactId } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

export async function unlinkEntryArtifact(entryId: string, artifactId: string) {
  await prisma.entryArtifact.delete({ where: { entryId_artifactId: { entryId, artifactId } } }).catch(() => {});
  const entry = await prisma.encyclopediaEntry.findUnique({ where: { id: entryId }, select: { slug: true } });
  if (entry) revalidatePath(`/encyclopedia/${entry.slug}`);
}

// Link a person to a theory
export async function linkPersonTheory(personId: string, theoryId: string, role?: string) {
  await prisma.personTheory.create({ data: { personId, theoryId, role: role || null } }).catch(() => {});
  const person = await prisma.person.findUnique({ where: { id: personId }, select: { slug: true } });
  if (person) revalidatePath(`/people/${person.slug}`);
}

export async function unlinkPersonTheory(personId: string, theoryId: string) {
  await prisma.personTheory.delete({ where: { personId_theoryId: { personId, theoryId } } }).catch(() => {});
  const person = await prisma.person.findUnique({ where: { id: personId }, select: { slug: true } });
  if (person) revalidatePath(`/people/${person.slug}`);
}

// Get all linkable entities for relationship dropdowns
export async function getLinkableEntities() {
  const [episodes, entries, people, locations, artifacts, civilizations, theories, deities, texts] = await Promise.all([
    prisma.episode.findMany({ select: { id: true, title: true, seasonNumber: true, episodeNumber: true }, orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }] }),
    prisma.encyclopediaEntry.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
    prisma.person.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.artifact.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.civilization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.theory.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
    prisma.deity.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.ancientText.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  return { episodes, entries, people, locations, artifacts, civilizations, theories, deities, texts };
}
