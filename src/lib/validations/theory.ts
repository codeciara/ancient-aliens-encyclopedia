import { z } from "zod/v4";

export const theorySchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  overview: z.string().optional().default(""),
  historicalContext: z.string().optional().default(""),
  keyArguments: z.string().optional().default(""),
  supportingEvidence: z.string().optional().default(""),
  counterArguments: z.string().optional().default(""),
  relatedTexts: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type TheoryFormData = z.infer<typeof theorySchema>;
