interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && (
        <p className="mt-1.5 text-muted-foreground font-body text-base">{subtitle}</p>
      )}
      <div className="mt-5 h-px bg-border/60" />
    </div>
  );
}
