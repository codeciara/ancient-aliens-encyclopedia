"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const sourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().optional().default(""),
  publicationYear: z.coerce.number().int().optional().nullable(),
  publisher: z.string().optional().default(""),
  url: z.string().optional().default(""),
  isbn: z.string().optional().default(""),
  sourceType: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export async function getSources(options?: { search?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { author: { contains: options.search } },
    ];
  }
  return prisma.source.findMany({
    where,
    orderBy: { title: "asc" },
    include: { _count: { select: { citations: true } } },
  });
}

export async function getSourceById(id: string) {
  return prisma.source.findUnique({
    where: { id },
    include: { citations: true },
  });
}

export async function createSource(_prevState: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = sourceSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  await prisma.source.create({
    data: {
      title: data.title,
      author: data.author || null,
      publicationYear: data.publicationYear ?? null,
      publisher: data.publisher || null,
      url: data.url || null,
      isbn: data.isbn || null,
      sourceType: data.sourceType || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/sources");
  redirect("/sources");
}

export async function deleteSource(id: string) {
  await prisma.source.delete({ where: { id } });
  revalidatePath("/sources");
  redirect("/sources");
}
