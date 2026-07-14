interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "status" | "evidence";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variantStyles = {
    default: "bg-parchment-dark text-charcoal",
    status: "", // Applied via className
    evidence: "border", // Applied via className
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
