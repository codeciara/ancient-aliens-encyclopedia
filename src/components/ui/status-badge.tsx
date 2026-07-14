import { Badge } from "./badge";
import { STATUS_COLORS, PublicationStatus } from "@/types";

interface StatusBadgeProps {
  status: PublicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="status" className={STATUS_COLORS[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
