import { Link } from "react-router-dom";

interface CTAButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function CTAButton({ to, children, variant = "primary", className = "" }: CTAButtonProps) {
  const base = "inline-block whitespace-nowrap px-6 py-3 font-body text-sm font-medium tracking-wide uppercase transition-all duration-200 border";
  const variants = {
    primary: "bg-primary text-primary-foreground border-primary hover:brightness-110",
    secondary: "bg-secondary text-secondary-foreground border-secondary hover:brightness-110",
    outline: "bg-transparent text-foreground border-foreground/30 hover:border-primary hover:text-primary",
  };

  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
