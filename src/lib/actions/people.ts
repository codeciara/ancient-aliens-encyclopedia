"use server";

import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validations/person";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPeople(options?: { status?: string; search?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { biography: { contains: options.search } },
    ];
  }
  return prisma.person.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { episodePeople: true, personTheories: true } } },
  });
}

export async function getPersonBySlug(slug: string) {
  return prisma.person.findUnique({
    where: { slug },
    include: {
      episodePeople: { include: { episode: true } },
      personTheories: { include: { theory: true } },
      citations: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createPerson(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  let slug = generateSlug(data.name);
  const existing = await prisma.person.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.person.create({
    data: { ...data, slug, biography: data.biography || null, mainTheories: data.mainTheories || null, publishedWorks: data.publishedWorks || null, associatedTopics: data.associatedTopics || null, supportAndCriticism: data.supportAndCriticism || null, internalNotes: data.internalNotes || null },
  });

  revalidatePath("/people");
  redirect("/people");
}

export async function updatePerson(slug: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const person = await prisma.person.findUnique({ where: { slug } });
  if (!person) return { error: { _form: ["Person not found"] } };

  let newSlug = slug;
  const expectedSlug = generateSlug(data.name);
  if (expectedSlug !== slug) {
    const collision = await prisma.person.findUnique({ where: { slug: expectedSlug } });
    if (!collision || collision.id === person.id) newSlug = expectedSlug;
  }

  await prisma.person.update({
    where: { slug },
    data: { ...data, slug: newSlug, biography: data.biography || null, mainTheories: data.mainTheories || null, publishedWorks: data.publishedWorks || null, associatedTopics: data.associatedTopics || null, supportAndCriticism: data.supportAndCriticism || null, internalNotes: data.internalNotes || null },
  });

  revalidatePath("/people");
  redirect(`/people/${newSlug}`);
}

export async function deletePerson(slug: string) {
  await prisma.person.delete({ where: { slug } });
  revalidatePath("/people");
  redirect("/people");
}
