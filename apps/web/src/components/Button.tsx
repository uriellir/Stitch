import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles = "rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
    ghost: "bg-transparent hover:bg-accent text-foreground",
    outline: "border-2 border-border bg-transparent text-foreground hover:bg-accent",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  
  const widthStyles = fullWidth ? "w-full" : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}
