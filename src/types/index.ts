// Publication status options
export const PUBLICATION_STATUSES = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

// Evidence types
export const EVIDENCE_TYPES = [
  "HISTORICAL_RECORD",
  "ARCHAEOLOGICAL_EVIDENCE",
  "ANCIENT_TEXT",
  "ORAL_TRADITION",
  "SCIENTIFIC_INTERPRETATION",
  "SPECULATIVE_THEORY",
  "DISPUTED_CLAIM",
  "UNRESOLVED_MYSTERY",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

// Evidence context levels (1-5)
export const EVIDENCE_CONTEXT_LEVELS = [
  { value: 1, label: "Primarily speculative" },
  { value: 2, label: "Based on a disputed interpretation" },
  { value: 3, label: "Contains genuine unanswered questions" },
  { value: 4, label: "Supported by meaningful physical or historical evidence" },
  { value: 5, label: "Well established by mainstream scholarship" },
] as const;

// Evidence type display labels
export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  HISTORICAL_RECORD: "Historical Record",
  ARCHAEOLOGICAL_EVIDENCE: "Archaeological Evidence",
  ANCIENT_TEXT: "Ancient Text",
  ORAL_TRADITION: "Oral Tradition",
  SCIENTIFIC_INTERPRETATION: "Scientific Interpretation",
  SPECULATIVE_THEORY: "Speculative Theory",
  DISPUTED_CLAIM: "Disputed Claim",
  UNRESOLVED_MYSTERY: "Unresolved Mystery",
};

// Status display colors
export const STATUS_COLORS: Record<PublicationStatus, string> = {
  DRAFT: "bg-stone-200 text-stone-700",
  REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

// Evidence context level colors
export const EVIDENCE_LEVEL_COLORS: Record<number, string> = {
  1: "bg-amber-900/20 text-amber-900 border-amber-900/30",
  2: "bg-amber-600/20 text-amber-700 border-amber-600/30",
  3: "bg-emerald-800/20 text-emerald-800 border-emerald-800/30",
  4: "bg-blue-800/20 text-blue-800 border-blue-800/30",
  5: "bg-green-900/20 text-green-900 border-green-900/30",
};
