import { z } from "zod/v4";

export const episodeSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  seasonNumber: z.coerce.number().int().min(1, "Season must be at least 1"),
  episodeNumber: z.coerce.number().int().min(1, "Episode must be at least 1"),
  originalAirDate: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  centralQuestion: z.string().optional().default(""),
  mainSubjects: z.string().optional().default(""),
  conventionalExplanations: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type EpisodeFormData = z.infer<typeof episodeSchema>;
