"use server";

import { prisma } from "@/lib/db";
import { theorySchema } from "@/lib/validations/theory";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTheories(options?: { status?: string; search?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { overview: { contains: options.search } },
    ];
  }
  return prisma.theory.findMany({
    where,
    orderBy: { title: "asc" },
    include: { _count: { select: { claims: true, personTheories: true } } },
  });
}

export async function getTheoryBySlug(slug: string) {
  return prisma.theory.findUnique({
    where: { slug },
    include: {
      personTheories: { include: { person: true } },
      claims: true,
      citations: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createTheory(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = theorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  let slug = generateSlug(data.title);
  const existing = await prisma.theory.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.theory.create({
    data: { ...data, slug, overview: data.overview || null, historicalContext: data.historicalContext || null, keyArguments: data.keyArguments || null, supportingEvidence: data.supportingEvidence || null, counterArguments: data.counterArguments || null, relatedTexts: data.relatedTexts || null, internalNotes: data.internalNotes || null },
  });

  revalidatePath("/theories");
  redirect("/theories");
}

export async function updateTheory(slug: string, _prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = theorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const theory = await prisma.theory.findUnique({ where: { slug } });
  if (!theory) return { error: { _form: ["Theory not found"] } };

  let newSlug = slug;
  const expectedSlug = generateSlug(data.title);
  if (expectedSlug !== slug) {
    const collision = await prisma.theory.findUnique({ where: { slug: expectedSlug } });
    if (!collision || collision.id === theory.id) newSlug = expectedSlug;
  }

  await prisma.theory.update({
    where: { slug },
    data: { ...data, slug: newSlug, overview: data.overview || null, historicalContext: data.historicalContext || null, keyArguments: data.keyArguments || null, supportingEvidence: data.supportingEvidence || null, counterArguments: data.counterArguments || null, relatedTexts: data.relatedTexts || null, internalNotes: data.internalNotes || null },
  });

  revalidatePath("/theories");
  redirect(`/theories/${newSlug}`);
}

export async function deleteTheory(slug: string) {
  await prisma.theory.delete({ where: { slug } });
  revalidatePath("/theories");
  redirect("/theories");
}
