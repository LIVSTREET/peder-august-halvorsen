interface TagPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function TagPill({ label, active = false, onClick }: TagPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-block px-3 py-1 text-xs font-mono tracking-wide border transition-colors duration-150 ${
        active
          ? "border-primary text-primary"
          : "border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
    </button>
  );
}
