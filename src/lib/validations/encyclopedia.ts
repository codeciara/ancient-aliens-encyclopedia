import { z } from "zod/v4";

export const encyclopediaEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  alternateNames: z.string().optional().default(""),
  category: z.string().optional().default(""),
  briefOverview: z.string().optional().default(""),
  historicalBackground: z.string().optional().default(""),
  ancientAstronautView: z.string().optional().default(""),
  mainstreamView: z.string().optional().default(""),
  evidenceCited: z.string().optional().default(""),
  unresolvedQuestions: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type EncyclopediaEntryFormData = z.infer<typeof encyclopediaEntrySchema>;
