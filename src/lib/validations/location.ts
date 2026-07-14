import { z } from "zod/v4";

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required").max(300),
  country: z.string().optional().default(""),
  region: z.string().optional().default(""),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  civilization: z.string().optional().default(""),
  historicalPeriod: z.string().optional().default(""),
  knownBuilders: z.string().optional().default(""),
  description: z.string().optional().default(""),
  archaeologicalConsensus: z.string().optional().default(""),
  ancientAstronautView: z.string().optional().default(""),
  unresolvedQuestions: z.string().optional().default(""),
  mapReference: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type LocationFormData = z.infer<typeof locationSchema>;
