import { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "outline";
}

export function Chip({ children, selected = false, onClick, variant = "default" }: ChipProps) {
  const baseStyles = "px-4 py-2 rounded-full text-sm transition-all duration-200 inline-flex items-center gap-2";
  
  const variantStyles = {
    default: selected
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground hover:bg-muted/80",
    outline: selected
      ? "bg-primary text-primary-foreground border-2 border-primary"
      : "bg-transparent text-foreground border-2 border-border hover:bg-accent",
  };
  
  const clickableStyles = onClick ? "cursor-pointer active:scale-95" : "";
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${clickableStyles}`}
    >
      {children}
    </button>
  );
}
