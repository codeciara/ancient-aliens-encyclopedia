import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-parchment p-4 mb-4">
        <Icon className="h-8 w-8 text-sandstone" />
      </div>
      <h3 className="font-heading text-lg text-charcoal mb-1">{title}</h3>
      <p className="text-sm text-charcoal-lighter max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
