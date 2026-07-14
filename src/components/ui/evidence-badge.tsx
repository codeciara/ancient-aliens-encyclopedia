import { Badge } from "./badge";
import { EVIDENCE_TYPE_LABELS, EVIDENCE_LEVEL_COLORS, EvidenceType } from "@/types";

interface EvidenceTypeBadgeProps {
  type: EvidenceType;
}

export function EvidenceTypeBadge({ type }: EvidenceTypeBadgeProps) {
  return (
    <Badge variant="default" className="bg-parchment-dark text-charcoal-light">
      {EVIDENCE_TYPE_LABELS[type]}
    </Badge>
  );
}

interface EvidenceLevelBadgeProps {
  level: number;
}

export function EvidenceLevelBadge({ level }: EvidenceLevelBadgeProps) {
  const labels: Record<number, string> = {
    1: "Speculative",
    2: "Disputed",
    3: "Unanswered",
    4: "Meaningful",
    5: "Established",
  };

  return (
    <Badge variant="evidence" className={EVIDENCE_LEVEL_COLORS[level] || ""}>
      Level {level}: {labels[level] || "Unknown"}
    </Badge>
  );
}
