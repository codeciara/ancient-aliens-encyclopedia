import { z } from "zod/v4";

export const personSchema = z.object({
  name: z.string().min(1, "Name is required").max(300),
  biography: z.string().optional().default(""),
  mainTheories: z.string().optional().default(""),
  publishedWorks: z.string().optional().default(""),
  associatedTopics: z.string().optional().default(""),
  supportAndCriticism: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type PersonFormData = z.infer<typeof personSchema>;
